import os

filepath = "src/store/useAuraStore.tsx"
with open(filepath, "r") as f:
    content = f.read()

# 1. Add Whitelabel Config Type
target_types = """export type Site = {"""
replacement_types = """export type WhitelabelConfig = {
  isActive: boolean;
  companyName: string;
  logoBase64: string | null;
  primaryColor: string;
};

export type Site = {"""
content = content.replace(target_types, replacement_types)

# 2. Add whitelabelConfig to context value type
target_context_type = """  activeSiteId: string;"""
replacement_context_type = """  activeSiteId: string;
  whitelabelConfig: WhitelabelConfig;
  updateWhitelabel: (updates: Partial<WhitelabelConfig>) => void;"""
content = content.replace(target_context_type, replacement_context_type)

# 3. Add state in provider
target_state = """  const [activeSiteId, setActiveSiteId] = useState<string>("default_site");"""
replacement_state = """  const [activeSiteId, setActiveSiteId] = useState<string>("default_site");
  const [whitelabelConfig, setWhitelabelConfig] = useState<WhitelabelConfig>({
    isActive: false, companyName: "Aura OS", logoBase64: null, primaryColor: "#6366f1"
  });"""
content = content.replace(target_state, replacement_state)

target_cache = """const cachedActiveSite = localStorage.getItem("kira_cad_active_site");"""
replacement_cache = """const cachedActiveSite = localStorage.getItem("kira_cad_active_site");
    const cachedWhitelabel = localStorage.getItem("kira_cad_whitelabel");"""
content = content.replace(target_cache, replacement_cache)

target_cache2 = """if (cachedActiveSite) setActiveSiteId(cachedActiveSite);"""
replacement_cache2 = """if (cachedActiveSite) setActiveSiteId(cachedActiveSite);
    if (cachedWhitelabel) try { setWhitelabelConfig(JSON.parse(cachedWhitelabel)); } catch(e) {}"""
content = content.replace(target_cache2, replacement_cache2)

target_save = """localStorage.setItem("kira_cad_active_site", activeSiteId);"""
replacement_save = """localStorage.setItem("kira_cad_active_site", activeSiteId);
    localStorage.setItem("kira_cad_whitelabel", JSON.stringify(whitelabelConfig));"""
content = content.replace(target_save, replacement_save)

target_method = """const setActiveSite = (id: string) => {"""
replacement_method = """const updateWhitelabel = (updates: Partial<WhitelabelConfig>) => {
    setWhitelabelConfig(prev => ({ ...prev, ...updates }));
  };
  const setActiveSite = (id: string) => {"""
content = content.replace(target_method, replacement_method)

target_export = """sites, activeSiteId, addSite, setActiveSite"""
replacement_export = """sites, activeSiteId, addSite, setActiveSite, whitelabelConfig, updateWhitelabel"""
content = content.replace(target_export, replacement_export)

with open(filepath, "w") as f:
    f.write(content)

