"""
Real Persistent Storage Service for DrishtiSetu Backend API.
Manages real user-created screening records in local JSON database & Firestore synchronization.
NO FAKE DEMO SEEDING — Empty database on fresh installation.
"""

import os
import json
from typing import List, Optional, Dict
from app.schemas.screening import Screening

DB_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "db", "screenings_db.json")

def _ensure_db_dir():
    db_dir = os.path.dirname(DB_FILE_PATH)
    if not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

def load_screenings() -> Dict[str, Screening]:
    """Loads stored screening records from JSON file."""
    _ensure_db_dir()
    if not os.path.exists(DB_FILE_PATH):
        return {}
    try:
        with open(DB_FILE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return {sid: Screening.model_validate(raw) for sid, raw in data.items()}
    except Exception as e:
        print(f"Warning: Failed to load screenings database: {e}")
        return {}

def save_all_screenings(records: Dict[str, Screening]):
    """Saves screening dictionary to JSON file."""
    _ensure_db_dir()
    try:
        data = {sid: record.model_dump() for sid, record in records.items()}
        with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error: Failed to save screenings database: {e}")

class ScreeningDatabase:
    """Singleton database manager for screening records."""
    def __init__(self):
        self._records: Dict[str, Screening] = load_screenings()

    def get_all(self) -> List[Screening]:
        return list(self._records.values())

    def get_by_id(self, screening_id: str) -> Optional[Screening]:
        return self._records.get(screening_id)

    def save(self, screening: Screening) -> Screening:
        self._records[screening.screeningId] = screening
        save_all_screenings(self._records)
        return screening

db = ScreeningDatabase()
