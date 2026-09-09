"""
Validation script for DrishtiSetu 5-Class DR Classification.
Evaluates validation loss, accuracy, and referable DR sensitivity/specificity metrics.
"""

import torch
import numpy as np
from typing import Dict, Any, Tuple

def validate_model(model: torch.nn.Module, val_loader: Any, criterion: Any, device: torch.device) -> Tuple[float, float, Dict[str, float]]:
    model.eval()
    val_loss = 0.0
    correct = 0
    total = 0
    all_preds = []
    all_targets = []

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            logits = model(images)
            loss = criterion(logits, labels)
            val_loss += loss.item() * images.size(0)

            preds = torch.argmax(logits, dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(labels.cpu().numpy())

    avg_loss = val_loss / max(total, 1)
    acc = correct / max(total, 1)
    
    # Calculate Referable DR (Level 2+) sensitivity & specificity
    ref_targets = np.array(all_targets) >= 2
    ref_preds = np.array(all_preds) >= 2
    
    tp = np.sum((ref_preds == 1) & (ref_targets == 1))
    tn = np.sum((ref_preds == 0) & (ref_targets == 0))
    fp = np.sum((ref_preds == 1) & (ref_targets == 0))
    fn = np.sum((ref_preds == 0) & (ref_targets == 1))

    sensitivity = float(tp / (tp + fn)) if (tp + fn) > 0 else 0.0
    specificity = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0

    metrics = {
        "val_loss": round(avg_loss, 4),
        "val_accuracy": round(acc, 4),
        "referable_sensitivity": round(sensitivity, 4),
        "referable_specificity": round(specificity, 4)
    }

    return avg_loss, acc, metrics
