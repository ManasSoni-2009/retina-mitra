"""
DRIVE (Digital Retinal Images for Vessel Extraction) Adapter & Loader.
Supports binary vessel segmentation mask training and validation.
"""

import os
from typing import List, Dict, Any

class DRIVEDatasetAdapter:
    """Adapter for DRIVE retinal vessel segmentation dataset."""

    def __init__(self, root_dir: str = "ml/datasets/data/drive"):
        self.root_dir = root_dir

    def is_available(self) -> bool:
        return os.path.exists(self.root_dir)

    def load_metadata(self) -> List[Dict[str, Any]]:
        records = []
        train_dir = os.path.join(self.root_dir, "training", "images")
        if not os.path.exists(train_dir):
            # Synthetic placeholder entries
            return [
                {
                    "image_id": f"{i:02d}_training",
                    "image_path": f"drive_synth_{i}.tif",
                    "mask_path": f"drive_synth_mask_{i}.gif",
                    "source": "DRIVE"
                }
                for i in range(21, 41)
            ]

        for fname in os.listdir(train_dir):
            if fname.endswith((".tif", ".png", ".jpg")):
                img_id = fname.split("_")[0]
                records.append({
                    "image_id": img_id,
                    "image_path": os.path.join(train_dir, fname),
                    "mask_path": os.path.join(self.root_dir, "training", "1st_manual", f"{img_id}_manual1.gif"),
                    "source": "DRIVE"
                })
        return records
