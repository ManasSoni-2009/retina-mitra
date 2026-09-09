"""
APTOS 2019 Blindness Detection Dataset Adapter & Loader.
Supports 5-class ICDR severity classification (0-4).
"""

import os
import cv2
import pandas as pd
import numpy as np
from typing import Tuple, List, Dict, Any, Optional

class APTOSDatasetAdapter:
    """Adapter for APTOS 2019 Kaggle dataset."""
    
    def __init__(self, root_dir: str = "ml/datasets/data/aptos2019"):
        self.root_dir = root_dir
        self.csv_path = os.path.join(root_dir, "train.csv")
        self.img_dir = os.path.join(root_dir, "train_images")

    def is_available(self) -> bool:
        return os.path.exists(self.csv_path) and os.path.exists(self.img_dir)

    def load_metadata(self) -> List[Dict[str, Any]]:
        if not self.is_available():
            # Return synthetic metadata placeholder when local raw dataset files are not placed
            return [
                {"image_id": f"aptos_synth_{i}", "patient_id": f"PAT-APTOS-{i//2}", "diagnosis": i % 5, "source": "APTOS2019"}
                for i in range(50)
            ]
        
        df = pd.read_csv(self.csv_path)
        records = []
        for idx, row in df.iterrows():
            img_name = f"{row['id_code']}.png"
            img_path = os.path.join(self.img_dir, img_name)
            records.append({
                "image_id": row["id_code"],
                "patient_id": row["id_code"],  # Individual scans
                "path": img_path,
                "diagnosis": int(row["diagnosis"]),
                "source": "APTOS2019"
            })
        return records
