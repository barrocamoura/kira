import os

# 1. Update useAuraStore.tsx to add removeDevice
filepath = "src/store/useAuraStore.tsx"
with open(filepath, "r") as f:
    content = f.read()

target_remove = "  setDevices: (devices: Device[]) => void;"
replacement_remove = "  setDevices: (devices: Device[]) => void;\n  removeDevice: (id: string) => void;"
content = content.replace(target_remove, replacement_remove)

target_remove_impl = "const addStructuralDevice = (type: DeviceType) => {"
replacement_remove_impl = "const removeDevice = (id: string) => {\n    setDevices(prev => prev.filter(d => d.id !== id));\n  };\n  const addStructuralDevice = (type: DeviceType) => {"
content = content.replace(target_remove_impl, replacement_remove_impl)

target_export = "removeAutomation, setDevices,"
replacement_export = "removeAutomation, setDevices, removeDevice,"
content = content.replace(target_export, replacement_export)

with open(filepath, "w") as f:
    f.write(content)

# 2. Update KiraCAD.tsx to fix getState() calls
filepath = "src/components/CAD/KiraCAD.tsx"
with open(filepath, "r") as f:
    content = f.read()

target_kirastore = "const { devices, buildMode, toggleDevice, updateDevice, saveToCloud, isSaving, saveSuccess, setBuildMode, addStructuralDevice, isDrawingZone, setIsDrawingZone, setCurrentZonePoints } = useAuraStore();"
replacement_kirastore = "const { devices, buildMode, toggleDevice, updateDevice, saveToCloud, isSaving, saveSuccess, setBuildMode, addStructuralDevice, isDrawingZone, setIsDrawingZone, setCurrentZonePoints, addZone, setDevices } = useAuraStore();"
content = content.replace(target_kirastore, replacement_kirastore)

target_getState1 = "useAuraStore.getState().addZone(z);"
replacement_getState1 = "addZone(z);"
content = content.replace(target_getState1, replacement_getState1)

target_getState2 = "useAuraStore.getState().setDevices(prev => [...prev, {"
replacement_getState2 = "setDevices(prev => [...prev, {"
content = content.replace(target_getState2, replacement_getState2)

with open(filepath, "w") as f:
    f.write(content)

# 3. Update Blueprint2D.tsx for Trash Icon and better Inspector toggle
filepath = "src/components/Blueprint2D.tsx"
with open(filepath, "r") as f:
    content = f.read()

target_bp_import = "import { RotateCw, Expand, Shrink, Settings2, X, Save, Wifi, Cpu, Link as LinkIcon } from \"lucide-react\";"
replacement_bp_import = "import { RotateCw, Expand, Shrink, Settings2, X, Save, Wifi, Cpu, Link as LinkIcon, Trash2 } from \"lucide-react\";"
content = content.replace(target_bp_import, replacement_bp_import)

target_bp_store = "const { inventory, changeInventory, zones, addZone, isDrawingZone, setIsDrawingZone, currentZonePoints, setCurrentZonePoints } = useAuraStore();"
replacement_bp_store = "const { inventory, changeInventory, zones, addZone, isDrawingZone, setIsDrawingZone, currentZonePoints, setCurrentZonePoints, removeDevice } = useAuraStore();"
content = content.replace(target_bp_store, replacement_bp_store)

target_bp_overlay = """<div className="w-px h-full bg-white/20 mx-1" />
                <button onPointerDown={(e) => { e.stopPropagation(); setInspectorOpen(true); }} className="p-1 hover:bg-white/20 rounded text-blue-400 flex items-center gap-1" title="Configurar">
                  <Settings2 className="w-4 h-4" />
                </button>"""
replacement_bp_overlay = """<div className="w-px h-full bg-white/20 mx-1" />
                <button onPointerDown={(e) => { e.stopPropagation(); setInspectorOpen(true); }} className="p-1 hover:bg-white/20 rounded text-blue-400 flex items-center gap-1" title="Configurar">
                  <Settings2 className="w-4 h-4" />
                </button>
                <div className="w-px h-full bg-white/20 mx-1" />
                <button onPointerDown={(e) => { e.stopPropagation(); removeDevice(device.id); setInspectorOpen(false); }} className="p-1 hover:bg-white/20 rounded text-red-400 flex items-center gap-1" title="Apagar">
                  <Trash2 className="w-4 h-4" />
                </button>"""
content = content.replace(target_bp_overlay, replacement_bp_overlay)

with open(filepath, "w") as f:
    f.write(content)
