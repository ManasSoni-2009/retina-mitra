"""
Temperature Scaling Post-Processing Confidence Calibration Module.
Calibrates overconfident neural network logit probabilities and evaluates Expected Calibration Error (ECE).
If calibration has not been trained, reports calibration status as UNCALIBRATED_PROTOTYPE.
"""

import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from typing import Tuple, Dict, Any

class TemperatureScaler(nn.Module):
    """
    Learns a single scalar temperature T > 0 to scale network logits p = softmax(L / T).
    """

    def __init__(self):
        super(TemperatureScaler, self).__init__()
        self.temperature = nn.Parameter(torch.ones(1) * 1.5)
        self.is_calibrated = False

    def forward(self, logits: torch.Tensor) -> torch.Tensor:
        return logits / self.temperature

    def fit(self, val_logits: torch.Tensor, val_labels: torch.Tensor):
        """
        Fits temperature T on validation set logits using cross-entropy loss.
        """
        self.to(val_logits.device)
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.LBFGS([self.temperature], lr=0.01, max_iter=50)

        def eval_loss():
            optimizer.zero_grad()
            loss = criterion(self.forward(val_logits), val_labels)
            loss.backward()
            return loss

        optimizer.step(eval_loss)
        self.is_calibrated = True
        print(f"Learned optimal scaling temperature T = {self.temperature.item():.4f}")

def calculate_ece(probs: np.ndarray, labels: np.ndarray, n_bins: int = 10) -> float:
    """
    Calculates Expected Calibration Error (ECE).
    """
    confidences = np.max(probs, axis=1)
    predictions = np.argmax(probs, axis=1)
    accuracies = (predictions == labels)

    bin_boundaries = np.linspace(0, 1, n_bins + 1)
    ece = 0.0

    for i in range(n_bins):
        bin_lower = bin_boundaries[i]
        bin_upper = bin_boundaries[i + 1]
        
        in_bin = (confidences > bin_lower) & (confidences <= bin_upper)
        prop_in_bin = np.mean(in_bin)

        if prop_in_bin > 0:
            accuracy_in_bin = np.mean(accuracies[in_bin])
            avg_confidence_in_bin = np.mean(confidences[in_bin])
            ece += np.abs(accuracy_in_bin - avg_confidence_in_bin) * prop_in_bin

    return float(ece)

def evaluate_calibration_status(
    raw_logits: torch.Tensor,
    scaler: TemperatureScaler = None
) -> Dict[str, Any]:
    """
    Returns raw confidence, calibrated confidence, and calibration status metadata.
    """
    raw_probs = torch.softmax(raw_logits, dim=-1).cpu().numpy()[0]
    raw_conf = float(np.max(raw_probs))
    raw_entropy = float(-np.sum(raw_probs * np.log(raw_probs + 1e-12)))

    if scaler is not None and scaler.is_calibrated:
        with torch.no_grad():
            calibrated_logits = scaler(raw_logits)
            calibrated_probs = torch.softmax(calibrated_logits, dim=-1).cpu().numpy()[0]
            cal_conf = float(np.max(calibrated_probs))
            status = "TEMPERATURE_SCALED_CALIBRATED"
    else:
        cal_conf = raw_conf
        status = "UNCALIBRATED_PROTOTYPE"

    # Prototype Abstention Rule
    # Require human review if calibrated confidence is below 0.65 or entropy > 1.0
    abstain_recommendation = (cal_conf < 0.65) or (raw_entropy > 1.0)

    return {
        "raw_confidence": round(raw_conf, 4),
        "calibrated_confidence": round(cal_conf, 4),
        "uncertainty_entropy": round(raw_entropy, 4),
        "calibration_status": status,
        "abstain_recommendation": abstain_recommendation
    }
