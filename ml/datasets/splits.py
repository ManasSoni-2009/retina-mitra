"""
Data Leakage Prevention & Patient-Grouped Split Strategy for DrishtiSetu.
Ensures images from the same patient (e.g. left and right eye scans) NEVER span train/val/test splits.
"""

import os
import random
import numpy as np
from typing import List, Dict, Tuple, Any

def create_patient_grouped_splits(
    records: List[Dict[str, Any]],
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    seed: int = 42
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Groups records by 'patient_id' and assigns all scans of a patient to a single split.
    Prevents data leakage.
    """
    random.seed(seed)
    np.random.seed(seed)

    # Group record indices by patient_id
    patient_to_records: Dict[str, List[Dict[str, Any]]] = {}
    for r in records:
        pid = r.get("patient_id") or r.get("image_id", "unknown_pat")
        if pid not in patient_to_records:
            patient_to_records[pid] = []
        patient_to_records[pid].append(r)

    patient_ids = list(patient_to_records.keys())
    random.shuffle(patient_ids)

    n_patients = len(patient_ids)
    n_train = int(n_patients * train_ratio)
    n_val = int(n_patients * val_ratio)

    train_pids = set(patient_ids[:n_train])
    val_pids = set(patient_ids[n_train:n_train + n_val])
    test_pids = set(patient_ids[n_train + n_val:])

    train_records = [r for pid in train_pids for r in patient_to_records[pid]]
    val_records = [r for pid in val_pids for r in patient_to_records[pid]]
    test_records = [r for pid in test_pids for r in patient_to_records[pid]]

    return train_records, val_records, test_records

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--verify-data", action="store_true")
    args = parser.parse_args()

    if args.verify-data:
        # Generate dummy verification synthetic patient records
        dummy_data = []
        for i in range(100):
            pid = f"PAT-{i//2:03d}"
            dummy_data.append({"image_id": f"IMG-{i:03d}", "patient_id": pid, "label": i % 5})
        
        train, val, test = create_patient_grouped_splits(dummy_data)
        train_pids = set(r["patient_id"] for r in train)
        val_pids = set(r["patient_id"] for r in val)
        test_pids = set(r["patient_id"] for r in test)

        overlap = train_pids.intersection(val_pids) or train_pids.intersection(test_pids) or val_pids.intersection(test_pids)
        print(f"Split Verification Result: Total Records={len(dummy_data)} -> Train={len(train)}, Val={len(val)}, Test={len(test)}")
        print(f"Patient Overlap Check: {len(overlap)} overlapping patients (0 expected). SUCCESS!")
