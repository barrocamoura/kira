import os

filepath = "src/components/Widgets/AutomationsBuilder.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = """            actionDeviceId: data.action_device_id,
            actionCommand: data.action_command,
            isActive: data.is_active
          });"""

replacement = """            actionDeviceId: data.action_device_id,
            actionCommand: data.action_command
          });"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, "w") as f:
        f.write(content)
    print("Fixed")
else:
    print("Not found")
