"""
Centralized Hyperparameter & Experiment Configuration for DrishtiSetu ML Pipeline.
Keeps hyperparameters in structured configuration rather than scattered throughout code.
"""

import os
from dataclasses import dataclass, field
from typing import List, Dict, Any

@dataclass
class TrainingConfig:
    # Model Architecture
    arch_backbone: str = "efficientnet_b0"  # Options: efficientnet_b0, convnext_tiny
    num_classes: int = 5
    pretrained: bool = True
    
    # Image & Preprocessing Parameters
    img_size: int = 384
    normalize_mean: List[float] = field(default_factory=lambda: [0.485, 0.456, 0.406])
    normalize_std: List[float] = field(default_factory=lambda: [0.229, 0.224, 0.225])
    
    # Optimization Hyperparameters
    batch_size: int = 16
    epochs: int = 25
    learning_rate: float = 3e-4
    weight_decay: float = 1e-4
    seed: int = 42
    
    # Class Imbalance Mitigation
    # Default strategy: Class-weighted Cross-Entropy loss based on dataset prior frequencies
    use_class_weights: bool = True
    class_weights: List[float] = field(default_factory=lambda: [1.0, 2.5, 1.8, 3.0, 3.5])
    
    # Thresholds & Referable DR Definition
    referable_threshold_grade: int = 2  # Level 2+ (Moderate NPDR or higher) is Referable DR
    confidence_abstention_threshold: float = 0.65
    
    # Directories & Checkpoints
    checkpoint_dir: str = os.path.join(os.path.dirname(__file__), "..", "checkpoints")
    output_eval_dir: str = os.path.join(os.path.dirname(__file__), "..", "evaluation", "reports")

DEFAULT_CONFIG = TrainingConfig()
