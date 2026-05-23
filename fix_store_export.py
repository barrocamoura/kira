import os

filepath = "src/store/useAuraStore.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = """    <AuraStoreContext.Provider value={{
      devices, zones, automations, inventory, buildMode, activeLiveWidget, isDrawingZone, setIsDrawingZone, currentZonePoints, setCurrentZonePoints,
      setBuildMode, setActiveLiveWidget, updateDevice, toggleDevice, addDeviceFromInventory,
      addStructuralDevice, addZone, setZones, addAutomation, removeAutomation, setDevices, removeDevice, changeInventory, saveToCloud, isSaving, saveSuccess
    }}>"""

replacement = """    <AuraStoreContext.Provider value={{
      devices: devices.filter(d => (d.siteId || "default_site") === activeSiteId),
      zones: zones.filter(z => (z.siteId || "default_site") === activeSiteId),
      automations: automations.filter(a => (a.siteId || "default_site") === activeSiteId),
      inventory, buildMode, activeLiveWidget, isDrawingZone, setIsDrawingZone, currentZonePoints, setCurrentZonePoints,
      setBuildMode, setActiveLiveWidget, updateDevice, toggleDevice, addDeviceFromInventory,
      addStructuralDevice, addZone, setZones, addAutomation, removeAutomation, setDevices, removeDevice, changeInventory, saveToCloud, isSaving, saveSuccess,
      sites, activeSiteId, addSite, setActiveSite
    }}>"""

content = content.replace(target, replacement)

with open(filepath, "w") as f:
    f.write(content)

