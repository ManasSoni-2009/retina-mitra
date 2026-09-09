"""
Unit Test Suite for DrishtiSetu Machine Learning Layer.
Tests:
- Patient-grouped data split (no data leakage)
- PyTorch 5-Class DR classifier forward pass
- UNet vessel & lesion candidate segmentation
- Grad-CAM heatmap generation
- Temperature Scaling confidence calibration & ECE
- Scientific Evaluation Report artifact generator
"""

import os
import sys
import torch
import numpy as np

# Ensure project root directory is in sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from ml.datasets.splits import create_patient_grouped_splits
from ml.classification.model import build_model
from ml.segmentation.unet import UNet
from ml.segmentation.vessel_segmentation import process_vessel_segmentation
from ml.segmentation.lesion_segmentation import detect_lesion_candidates
from ml.explainability.gradcam import GradCAMEngine
from ml.calibration.temperature_scaling import TemperatureScaler, evaluate_calibration_status, calculate_ece
from ml.evaluation.evaluate import generate_evaluation_report

def test_patient_grouped_splits_no_leakage():
    records = []
    for i in range(100):
        records.append({"image_id": f"IMG-{i}", "patient_id": f"PAT-{i//2}", "diagnosis": i % 5})
    
    train, val, test = create_patient_grouped_splits(records, seed=42)
    train_pids = set(r["patient_id"] for r in train)
    val_pids = set(r["patient_id"] for r in val)
    test_pids = set(r["patient_id"] for r in test)

    assert len(train_pids.intersection(val_pids)) == 0
    assert len(train_pids.intersection(test_pids)) == 0
    assert len(val_pids.intersection(test_pids)) == 0

def test_pytorch_classifier_forward():
    model = build_model(backbone="efficientnet_b0", num_classes=5, pretrained=False)
    x = torch.randn(2, 3, 224, 224)
    logits = model(x)
    assert logits.shape == (2, 5)

def test_unet_segmentation_forward():
    model = UNet(in_channels=3, out_channels=1)
    x = torch.randn(2, 3, 128, 128)
    out = model(x)
    assert out.shape == (2, 1, 128, 128)

def test_vessel_and_lesion_segmentation():
    img_bgr = np.zeros((200, 200, 3), dtype=np.uint8)
    img_bgr[50:150, 50:150] = [20, 50, 180]
    
    vessel_res = process_vessel_segmentation(img_bgr)
    assert "vessel_mask" in vessel_res and "vessel_overlay" in vessel_res
    assert vessel_res["vessel_mask"].shape == (200, 200)

    lesion_res = detect_lesion_candidates(img_bgr, dr_grade=2)
    assert "detected_lesions" in lesion_res and "lesion_overlay" in lesion_res

def test_gradcam_generation():
    model = build_model(backbone="efficientnet_b0", num_classes=5, pretrained=False)
    gradcam = GradCAMEngine(model)
    x = torch.randn(1, 3, 224, 224)
    heatmap = gradcam.generate_heatmap(x, target_class=2)
    assert heatmap.shape == (224, 224)

def test_temperature_scaling_calibration():
    logits = torch.tensor([[2.5, 0.5, 0.1, 0.0, 0.0]])
    res = evaluate_calibration_status(logits)
    assert "raw_confidence" in res and "calibrated_confidence" in res
    assert res["raw_confidence"] > 0.5

def test_evaluation_report_generator(tmp_path):
    report_html = generate_evaluation_report(output_dir=str(tmp_path))
    assert os.path.exists(report_html)
    assert os.path.exists(os.path.join(tmp_path, "metrics.json"))
    assert os.path.exists(os.path.join(tmp_path, "confusion_matrix.png"))
    assert os.path.exists(os.path.join(tmp_path, "calibration.png"))
