import json
from pathlib import Path


def load_json_data(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

            if "timetable" in str(file_path):
                return {
                    "days": data.get("days", []),
                    "sections": data.get("sections", []),
                }
            elif "buttons" in str(file_path):
                return {"buttons": data.get("buttons", [])}
            elif "names" in str(file_path):
                return {"names": data.get("names", [])}
            return data
    except (FileNotFoundError, json.JSONDecodeError, KeyError):
        if "timetable" in str(file_path):
            return {"days": [], "sections": []}
        elif "buttons" in str(file_path):
            return {"buttons": []}
        elif "names" in str(file_path):
            return {"names": []}
        return {}


def save_json_data(file_path, data):
    file_path.parent.mkdir(exist_ok=True, parents=True)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
