import json
import uuid
import random

manufacturers = ["Sonoff", "Shelly", "Aqara", "Fibaro", "Tuya", "Philips Hue", "Samsung", "LG", "Bosch", "Nest", "Ring", "Ecobee", "SolarEdge", "TP-Link", "Xiaomi", "IKEA"]

categories = [
    {"name": "Relay", "type": "light"},
    {"name": "Smart Plug", "type": "smart_plug"},
    {"name": "Motion Sensor", "type": "motion_sensor"},
    {"name": "Door/Window Sensor", "type": "door_lock"},
    {"name": "Temperature Sensor", "type": "temp_sensor"},
    {"name": "Smoke Sensor", "type": "smoke_sensor"},
    {"name": "Air Conditioner", "type": "ac"},
    {"name": "Thermostat", "type": "thermostat"},
    {"name": "Camera", "type": "camera"},
    {"name": "Smart TV", "type": "smart_tv"},
    {"name": "Washing Machine", "type": "washing_machine"},
    {"name": "Dishwasher", "type": "dishwasher"},
    {"name": "Refrigerator", "type": "fridge"},
    {"name": "Speaker", "type": "speaker"},
]

devices = []

def add_device(brand, cat_name, model, protocol, year, discontinued=False):
    cat = next(c for c in categories if c["name"] == cat_name)
    devices.append({
        "id": str(uuid.uuid4()),
        "manufacturer": brand,
        "category": cat["name"],
        "engine3dType": cat["type"],
        "modelName": model,
        "protocol": protocol,
        "releaseYear": year,
        "isDiscontinued": discontinued
    })

# Sonoff (Legacy & Modern)
add_device("Sonoff", "Relay", "Basic R1 (Legacy)", "Wi-Fi", 2016, True)
add_device("Sonoff", "Relay", "Basic R2", "Wi-Fi", 2018, True)
add_device("Sonoff", "Relay", "Basic R3", "Wi-Fi", 2020, False)
add_device("Sonoff", "Relay", "MINI R1", "Wi-Fi", 2019, True)
add_device("Sonoff", "Relay", "MINI R2", "Wi-Fi", 2020, False)
add_device("Sonoff", "Relay", "MINI R4 Extreme", "Wi-Fi", 2023, False)
add_device("Sonoff", "Relay", "ZBMINI", "Zigbee", 2021, False)
add_device("Sonoff", "Smart Plug", "S26 R1", "Wi-Fi", 2018, True)
add_device("Sonoff", "Smart Plug", "S26 R2", "Wi-Fi", 2021, False)
add_device("Sonoff", "Motion Sensor", "SNZB-03", "Zigbee", 2020, False)
add_device("Sonoff", "Temperature Sensor", "SNZB-02", "Zigbee", 2020, False)

# Shelly
add_device("Shelly", "Relay", "Shelly 1 V1", "Wi-Fi", 2018, True)
add_device("Shelly", "Relay", "Shelly 1 V2", "Wi-Fi", 2019, True)
add_device("Shelly", "Relay", "Shelly 1 V3", "Wi-Fi", 2020, True)
add_device("Shelly", "Relay", "Shelly Plus 1", "Wi-Fi", 2022, False)
add_device("Shelly", "Relay", "Shelly 1PM", "Wi-Fi", 2019, True)
add_device("Shelly", "Relay", "Shelly Plus 1PM", "Wi-Fi", 2022, False)
add_device("Shelly", "Relay", "Shelly Dimmer 1", "Wi-Fi", 2019, True)
add_device("Shelly", "Relay", "Shelly Dimmer 2", "Wi-Fi", 2021, False)
add_device("Shelly", "Smart Plug", "Shelly Plug", "Wi-Fi", 2020, False)
add_device("Shelly", "Smart Plug", "Shelly Plug S", "Wi-Fi", 2021, False)

# Aqara
add_device("Aqara", "Motion Sensor", "RTCGQ11LM (Legacy)", "Zigbee", 2018, True)
add_device("Aqara", "Motion Sensor", "Motion Sensor P1", "Zigbee", 2022, False)
add_device("Aqara", "Motion Sensor", "Presence Sensor FP1", "Zigbee", 2022, True)
add_device("Aqara", "Motion Sensor", "Presence Sensor FP2", "Wi-Fi", 2023, False)
add_device("Aqara", "Temperature Sensor", "WSDCGQ11LM", "Zigbee", 2018, False)
add_device("Aqara", "Temperature Sensor", "TVOC Air Quality Monitor", "Zigbee", 2021, False)

# Tuya (Generic)
for i in range(1, 20):
    add_device("Tuya", "Relay", f"Generic Switch Module v{i}", "Wi-Fi", 2018 + (i % 6), i < 15)
    add_device("Tuya", "Smart Plug", f"Generic Smart Socket EU {i}", "Wi-Fi", 2017 + (i % 7), i < 10)

# Xiaomi
add_device("Xiaomi", "Motion Sensor", "Mijia Motion Sensor", "Zigbee", 2016, True)
add_device("Xiaomi", "Temperature Sensor", "Mi Temperature and Humidity", "Bluetooth", 2018, True)

# IKEA
add_device("IKEA", "Relay", "TRÅDFRI Wireless control outlet", "Zigbee", 2018, False)
add_device("IKEA", "Motion Sensor", "TRÅDFRI Motion sensor", "Zigbee", 2019, False)

# Philips Hue
add_device("Philips Hue", "Relay", "Hue Color Gen 1", "Zigbee", 2012, True)
add_device("Philips Hue", "Relay", "Hue Color Gen 2", "Zigbee", 2015, True)
add_device("Philips Hue", "Relay", "Hue Color Gen 3", "Zigbee", 2019, False)
add_device("Philips Hue", "Relay", "Hue White Ambience", "Zigbee", 2020, False)

# Fibaro
add_device("Fibaro", "Motion Sensor", "Motion Sensor Gen 1", "Z-Wave", 2015, True)
add_device("Fibaro", "Motion Sensor", "Motion Sensor Gen 2", "Z-Wave", 2018, False)
add_device("Fibaro", "Smoke Sensor", "Smoke Sensor Gen 2", "Z-Wave", 2017, False)

# Samsung / LG / Bosch / etc
add_device("Samsung", "Refrigerator", "Family Hub Gen 1", "Wi-Fi", 2016, True)
add_device("Samsung", "Refrigerator", "Bespoke 4-Door", "Wi-Fi", 2023, False)
add_device("LG", "Air Conditioner", "ThinQ Portable", "Wi-Fi", 2019, True)
add_device("LG", "Air Conditioner", "ThinQ Dual Inverter", "Wi-Fi", 2022, False)

# Add 200 more random combinations for scale
import random
for i in range(200):
    brand = random.choice(["Tuya", "Generic OEM", "Brennenstuhl", "Nedis", "Hama"])
    cat = random.choice(categories)
    year = random.randint(2014, 2024)
    add_device(brand, cat["name"], f"Smart {cat['name']} X-{random.randint(100, 999)}", random.choice(["Wi-Fi", "Zigbee", "Bluetooth"]), year, year < 2021)

with open("src/data/catalog.json", "w") as f:
    json.dump(devices, f, indent=2)

print(f"Generated {len(devices)} devices.")
