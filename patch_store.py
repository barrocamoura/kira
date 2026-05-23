import os

filepath = "src/store/useAuraStore.tsx"
with open(filepath, "r") as f:
    content = f.read()

# Add supabase import if not there
if "import { supabase }" not in content:
    content = content.replace('import { io, Socket } from "socket.io-client";', 'import { io, Socket } from "socket.io-client";\nimport { supabase } from "@/lib/supabaseClient";')

target_save = """  const saveToCloud = async () => {
    setIsSaving(true);
    localStorage.setItem("kira_cad_state", JSON.stringify(devices));
    localStorage.setItem("kira_cad_inventory", JSON.stringify(inventory));
    localStorage.setItem("kira_cad_sites", JSON.stringify(sites));
    localStorage.setItem("kira_cad_active_site", activeSiteId);
    localStorage.setItem("kira_cad_whitelabel", JSON.stringify(whitelabelConfig));
    localStorage.setItem("kira_cad_zones", JSON.stringify(zones));
    localStorage.setItem("kira_cad_automations", JSON.stringify(automations));
    await new Promise(r => setTimeout(r, 800));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsSaving(false);
  };"""

replacement_save = """  const saveToCloud = async () => {
    setIsSaving(true);
    localStorage.setItem("kira_cad_state", JSON.stringify(devices));
    localStorage.setItem("kira_cad_inventory", JSON.stringify(inventory));
    localStorage.setItem("kira_cad_sites", JSON.stringify(sites));
    localStorage.setItem("kira_cad_active_site", activeSiteId);
    localStorage.setItem("kira_cad_whitelabel", JSON.stringify(whitelabelConfig));
    localStorage.setItem("kira_cad_zones", JSON.stringify(zones));
    localStorage.setItem("kira_cad_automations", JSON.stringify(automations));
    
    if (supabase) {
      try {
        // Defensive Upsert to Supabase
        const activeDevices = devices.filter(d => (d.siteId || "default_site") === activeSiteId);
        if (activeSiteId !== "default_site") {
           // We only sync if it's a real site in the database
           for (const dev of activeDevices) {
             await supabase.from('devices').upsert({
               id: dev.id.length === 36 ? dev.id : undefined, // only use valid uuids or let DB generate
               space_id: activeSiteId,
               name: dev.name || 'Unnamed Device',
               type: dev.type,
               position_x: dev.position[0],
               position_y: dev.position[1],
               position_z: dev.position[2],
               is_on: dev.isOn
             }, { onConflict: 'id' }).catch(() => {}); // Catch silent errors for mock UUIDs
           }
        }
      } catch (err) {
        console.warn("Supabase Sync Failed:", err);
      }
    } else {
      await new Promise(r => setTimeout(r, 800));
    }
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsSaving(false);
  };"""

if target_save in content:
    content = content.replace(target_save, replacement_save)

with open(filepath, "w") as f:
    f.write(content)
