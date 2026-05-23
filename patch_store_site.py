import os

filepath = "src/store/useAuraStore.tsx"
with open(filepath, "r") as f:
    content = f.read()

# 1. Add Site Type and siteId to existing types
target_types = """export type Automation = {"""
replacement_types = """export type Site = {
  id: string;
  name: string;
  type: "house" | "office" | "other";
};

export type Automation = {
  siteId?: string;
"""
content = content.replace(target_types, replacement_types)

content = content.replace("export type Zone = {\n  id: string;", "export type Zone = {\n  id: string;\n  siteId?: string;")
content = content.replace("export type Device = {\n  id: string;", "export type Device = {\n  id: string;\n  siteId?: string;")

# 2. Add sites to context value type
target_context_type = """  zones: Zone[];"""
replacement_context_type = """  sites: Site[];
  activeSiteId: string;
  zones: Zone[];"""
content = content.replace(target_context_type, replacement_context_type)

target_methods_type = """  addZone: (zone: Zone) => void;"""
replacement_methods_type = """  addSite: (site: Site) => void;
  setActiveSite: (id: string) => void;
  addZone: (zone: Zone) => void;"""
content = content.replace(target_methods_type, replacement_methods_type)

# 3. Add state in provider
target_state = """  const [zones, setZones] = useState<Zone[]>([]);"""
replacement_state = """  const [sites, setSites] = useState<Site[]>([{ id: "default_site", name: "A Minha Casa", type: "house" }]);
  const [activeSiteId, setActiveSiteId] = useState<string>("default_site");
  const [zones, setZones] = useState<Zone[]>([]);"""
content = content.replace(target_state, replacement_state)

target_cache = """const cachedZones = localStorage.getItem("kira_cad_zones");"""
replacement_cache = """const cachedSites = localStorage.getItem("kira_cad_sites");
    const cachedActiveSite = localStorage.getItem("kira_cad_active_site");
    const cachedZones = localStorage.getItem("kira_cad_zones");"""
content = content.replace(target_cache, replacement_cache)

target_cache2 = """if (cachedZones) try { setZones(JSON.parse(cachedZones)); } catch(e) {}"""
replacement_cache2 = """if (cachedSites) try { setSites(JSON.parse(cachedSites)); } catch(e) {}
    if (cachedActiveSite) setActiveSiteId(cachedActiveSite);
    if (cachedZones) try { setZones(JSON.parse(cachedZones)); } catch(e) {}"""
content = content.replace(target_cache2, replacement_cache2)

target_save = """localStorage.setItem("kira_cad_zones", JSON.stringify(zones));"""
replacement_save = """localStorage.setItem("kira_cad_sites", JSON.stringify(sites));
    localStorage.setItem("kira_cad_active_site", activeSiteId);
    localStorage.setItem("kira_cad_zones", JSON.stringify(zones));"""
content = content.replace(target_save, replacement_save)

# 4. Filter logic & creation logic (inject siteId on creation)
target_creation_zone = """setZones(prev => [...prev, zone]);"""
replacement_creation_zone = """setZones(prev => [...prev, { ...zone, siteId: activeSiteId }]);"""
content = content.replace(target_creation_zone, replacement_creation_zone)

target_creation_dev = """setDevices(prev => [...prev, newDevice]);"""
replacement_creation_dev = """setDevices(prev => [...prev, { ...newDevice, siteId: activeSiteId }]);"""
content = content.replace(target_creation_dev, replacement_creation_dev)

target_creation_auto = """setAutomations(prev => [...prev, auto]);"""
replacement_creation_auto = """setAutomations(prev => [...prev, { ...auto, siteId: activeSiteId }]);"""
content = content.replace(target_creation_auto, replacement_creation_auto)

# Add Site Methods
target_addzone = """const addZone = (zone: Zone) => {"""
replacement_addsite = """const addSite = (site: Site) => {
    setSites(prev => [...prev, site]);
    setActiveSiteId(site.id);
  };
  const setActiveSite = (id: string) => {
    setActiveSiteId(id);
  };
  const addZone = (zone: Zone) => {"""
content = content.replace(target_addzone, replacement_addsite)

# Filter exposed variables by activeSiteId!
target_export = """const value = {
    devices, zones, automations, inventory,
    buildMode, isDrawingZone, currentZonePoints,
    isSaving, saveSuccess, activeLiveWidget,
    toggleDevice, updateDevice,
    addStructuralDevice, addZone, setZones, addAutomation, removeAutomation, setDevices, removeDevice, changeInventory,
    saveToCloud, setBuildMode, setIsDrawingZone, setCurrentZonePoints, setActiveLiveWidget
  };"""
replacement_export = """const value = {
    // We filter lists so UI only sees current site data. Migration: if siteId is missing, assume it's default_site.
    devices: devices.filter(d => (d.siteId || "default_site") === activeSiteId),
    zones: zones.filter(z => (z.siteId || "default_site") === activeSiteId),
    automations: automations.filter(a => (a.siteId || "default_site") === activeSiteId),
    inventory, sites, activeSiteId,
    buildMode, isDrawingZone, currentZonePoints,
    isSaving, saveSuccess, activeLiveWidget,
    toggleDevice, updateDevice,
    addStructuralDevice, addZone, setZones, addAutomation, removeAutomation, setDevices, removeDevice, changeInventory,
    saveToCloud, setBuildMode, setIsDrawingZone, setCurrentZonePoints, setActiveLiveWidget, addSite, setActiveSite
  };"""
content = content.replace(target_export, replacement_export)

with open(filepath, "w") as f:
    f.write(content)

