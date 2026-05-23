import os

filepath = "src/components/CAD/KiraCAD.tsx"
with open(filepath, "r") as f:
    content = f.read()

# Fix useAuraStore.getState() error
content = content.replace("useAuraStore.getState().addStructuralDevice", "addStructuralDevice")

# Extract the rest of state from useAuraStore
target = "const { devices, buildMode, toggleDevice, updateDevice, saveToCloud, isSaving, saveSuccess, setBuildMode } = useAuraStore();"
replacement = 'const { devices, buildMode, toggleDevice, updateDevice, saveToCloud, isSaving, saveSuccess, setBuildMode, addStructuralDevice, isDrawingZone, setIsDrawingZone, setCurrentZonePoints } = useAuraStore();\nimport { Maximize } from "lucide-react";'
content = content.replace(target, replacement)

# Add the 'Desenhar Divisão' button
btn_target = '<button onClick={() => addStructuralDevice(\'wall\')}'
btn_replacement = '<button onClick={() => { setIsDrawingZone(!isDrawingZone); setCurrentZonePoints([]); }} className={`px-4 py-2 hover:bg-white/10 rounded-xl text-sm font-bold transition flex items-center gap-2 ${isDrawingZone ? "bg-indigo-600 text-white" : "text-white"}`}><Maximize className="w-4 h-4" /> {isDrawingZone ? "Cancelar Zona" : "Desenhar Divisão"}</button>\n                <button onClick={() => addStructuralDevice(\'wall\')}'
content = content.replace(btn_target, btn_replacement)

with open(filepath, "w") as f:
    f.write(content)
