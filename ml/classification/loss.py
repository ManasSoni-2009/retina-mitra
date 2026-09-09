"""
Class Imbalance Mitigation Loss Functions for DrishtiSetu.
Evaluates class distribution and provides Weighted Cross-Entropy Loss & Focal Loss options.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import List, Optional

class WeightedCrossEntropyLoss(nn.Module):
    """
    Weighted Cross-Entropy Loss to penalize under-represented minority classes
    (e.g., Severe NPDR Level 3 & Proliferative DR Level 4).
    """

    def __init__(self, class_weights: Optional[List[float]] = None):
        super(WeightedCrossEntropyLoss, self).__init__()
        if class_weights is not None:
            weight_tensor = torch.tensor(class_weights, dtype=torch.float32)
        else:
            weight_tensor = None
        self.criterion = nn.CrossEntropyLoss(weight=weight_tensor)

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        if self.criterion.weight is not None and self.criterion.weight.device != logits.device:
            self.criterion.weight = self.criterion.weight.to(logits.device)
        return self.criterion(logits, targets)

class FocalLoss(nn.Module):
    """
    Focal Loss for addressing class imbalance by down-weighting easy examples.
    FL(p_t) = -alpha_t * (1 - p_t)^gamma * log(p_t)
    """

    def __init__(self, gamma: float = 2.0, alpha: Optional[List[float]] = None):
        super(FocalLoss, self).__init__()
        self.gamma = gamma
        self.alpha = torch.tensor(alpha, dtype=torch.float32) if alpha is not None else None

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        ce_loss = F.cross_entropy(logits, targets, reduction='none')
        pt = torch.exp(-ce_loss)
        focal_loss = ((1 - pt) ** self.gamma) * ce_loss

        if self.alpha is not None:
            if self.alpha.device != logits.device:
                self.alpha = self.alpha.to(logits.device)
            at = self.alpha.gather(0, targets)
            focal_loss = at * focal_loss

        return focal_loss.mean()
