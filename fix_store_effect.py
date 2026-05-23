import os

filepath = "src/store/useAuraStore.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = """  useEffect(() => {
    const cachedDevices = localStorage.getItem("kira_cad_state");
    const cachedInventory = localStorage.getItem("kira_cad_inventory");
    
    if (socket) {
      socket.on("device:state_changed", (data: any) => {
        setDevices(prev => prev.map(d => {
          if (d.id === data.id) {
            return { ...d, isOn: data.state.isOn };
          }
          return d;
        }));
      });
      return () => { socket?.off("device:state_changed"); }
    }
  }, []);

  useEffect(() => {
    const cachedSites = localStorage.getItem("kira_cad_sites");
    const cachedActiveSite = localStorage.getItem("kira_cad_active_site");
    const cachedWhitelabel = localStorage.getItem("kira_cad_whitelabel");
    const cachedZones = localStorage.getItem("kira_cad_zones");
    const cachedAutomations = localStorage.getItem("kira_cad_automations");
    if (cachedDevices) try { setDevices(JSON.parse(cachedDevices)); } catch(e) {}
    if (cachedInventory) try { setInventory(JSON.parse(cachedInventory)); } catch(e) {}"""

replacement = """  useEffect(() => {
    const cachedDevices = localStorage.getItem("kira_cad_state");
    const cachedInventory = localStorage.getItem("kira_cad_inventory");
    const cachedSites = localStorage.getItem("kira_cad_sites");
    const cachedActiveSite = localStorage.getItem("kira_cad_active_site");
    const cachedWhitelabel = localStorage.getItem("kira_cad_whitelabel");
    const cachedZones = localStorage.getItem("kira_cad_zones");
    const cachedAutomations = localStorage.getItem("kira_cad_automations");
    
    if (cachedDevices) try { setDevices(JSON.parse(cachedDevices)); } catch(e) {}
    if (cachedInventory) try { setInventory(JSON.parse(cachedInventory)); } catch(e) {}
    if (cachedSites) try { setSites(JSON.parse(cachedSites)); } catch(e) {}
    if (cachedActiveSite) setActiveSiteId(cachedActiveSite);
    if (cachedWhitelabel) try { setWhitelabelConfig(JSON.parse(cachedWhitelabel)); } catch(e) {}
    if (cachedZones) try { setZones(JSON.parse(cachedZones)); } catch(e) {}
    if (cachedAutomations) try { setAutomations(JSON.parse(cachedAutomations)); } catch(e) {}

    if (socket) {
      socket.on("device:state_changed", (data: any) => {
        setDevices(prev => prev.map(d => {
          if (d.id === data.id) {
            return { ...d, isOn: data.state.isOn };
          }
          return d;
        }));
      });
      return () => { socket?.off("device:state_changed"); }
    }
  }, []);"""

content = content.replace(target, replacement)

with open(filepath, "w") as f:
    f.write(content)
