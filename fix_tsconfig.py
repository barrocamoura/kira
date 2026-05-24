import json

with open("tsconfig.json", "r") as f:
    config = json.load(f)

if "legacy-spero-website" not in config.get("exclude", []):
    config.setdefault("exclude", []).append("legacy-spero-website")

with open("tsconfig.json", "w") as f:
    json.dump(config, f, indent=2)
