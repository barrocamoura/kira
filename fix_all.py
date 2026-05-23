import os

filepath = "src/store/useAuraStore.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = 'import { createContext, useContext, useState, useEffect, ReactNode } from "react";'
replacement = 'import { createContext, useContext, useState, useEffect, ReactNode } from "react";\nimport { io, Socket } from "socket.io-client";'
if replacement not in content:
    content = content.replace(target, replacement)

with open(filepath, "w") as f:
    f.write(content)

tsconfig = "tsconfig.json"
import json
with open(tsconfig, "r") as f:
    config = json.load(f)

config["compilerOptions"]["jsx"] = "preserve"
config["compilerOptions"]["esModuleInterop"] = True

with open(tsconfig, "w") as f:
    json.dump(config, f, indent=2)

