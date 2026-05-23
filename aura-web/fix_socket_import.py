import os

filepath = "src/store/useAuraStore.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = 'import { Device, DeviceType } from "@/components/Scene3D";'
replacement = 'import { Device, DeviceType } from "@/components/Scene3D";\nimport { io, Socket } from "socket.io-client";'

if 'import { io, Socket }' not in content:
    content = content.replace(target, replacement)

with open(filepath, "w") as f:
    f.write(content)

