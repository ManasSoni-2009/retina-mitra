"""
PyTorch 5-Class Diabetic Retinopathy Classification Model.
Supports transfer learning backbones (EfficientNet-B0 or ConvNeXt-Tiny).
"""

import torch
import torch.nn as nn
import torchvision.models as models
from typing import Tuple

class DRClassifier(nn.Module):
    """
    5-Class Retinal Image Classifier for ICDR Severity Scale:
    0: No DR
    1: Mild NPDR
    2: Moderate NPDR
    3: Severe NPDR
    4: Proliferative DR
    """

    def __init__(self, backbone_name: str = "efficientnet_b0", num_classes: int = 5, pretrained: bool = True):
        super(DRClassifier, self).__init__()
        self.backbone_name = backbone_name
        self.num_classes = num_classes

        if backbone_name.startswith("convnext"):
            weights = models.ConvNeXt_Tiny_Weights.DEFAULT if pretrained else None
            base_model = models.convnext_tiny(weights=weights)
            in_features = base_model.classifier[2].in_features
            base_model.classifier[2] = nn.Identity()
            self.features = base_model
        else: # Default EfficientNet-B0
            weights = models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
            base_model = models.efficientnet_b0(weights=weights)
            in_features = base_model.classifier[1].in_features
            base_model.classifier = nn.Identity()
            self.features = base_model

        self.classifier_head = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.2),
            nn.Linear(256, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        feat = self.features(x)
        logits = self.classifier_head(feat)
        return logits

    def extract_features(self, x: torch.Tensor) -> torch.Tensor:
        return self.features(x)

def build_model(backbone: str = "efficientnet_b0", num_classes: int = 5, pretrained: bool = True) -> DRClassifier:
    return DRClassifier(backbone_name=backbone, num_classes=num_classes, pretrained=pretrained)
