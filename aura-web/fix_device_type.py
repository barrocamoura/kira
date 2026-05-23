import os

filepath = "src/components/Scene3D.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = """  isOn: boolean;
  name?: string;
  protocol?: "Matter" | "Zigbee" | "Wi-Fi" | "KNX" | "Unconfigured";
  address?: string;"""

replacement = """  isOn: boolean;
  name?: string;
  protocol?: "Matter" | "Zigbee" | "Wi-Fi" | "KNX" | "Unconfigured";
  address?: string;
  siteId?: string;
  zoneId?: string;"""

content = content.replace(target, replacement)

with open(filepath, "w") as f:
    f.write(content)

