"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Device, DeviceType } from "@/components/Scene3D";
import { io, Socket } from "socket.io-client";

export type WhitelabelConfig = {
  isActive: boolean;
  companyName: string;
  logoBase64: string | null;
  primaryColor: string;
};

export type Site = {
  id: string;
  name: string;
  type: "house" | "office" | "other";
};

export type Automation = {
  siteId?: string;

  id: string;
  name: string;
  triggerDeviceId: string;
  triggerCondition: string; // "on", "off", "motion_detected"
  actionDeviceId: string;
  actionCommand: string; // "turn_on", "turn_off", "set_color_blue"
};

export type Zone = {
  id: string;
  siteId?: string;
  name: string;
  points: [number, number][]; // [x, z] coordinates
  color: string;
};

export type InventoryItem = {
  catalogId: string;
  quantity: number;
};

interface AuraStoreContextProps {
  devices: Device[];
  sites: Site[];
  activeSiteId: string;
  whitelabelConfig: WhitelabelConfig;
  updateWhitelabel: (updates: Partial<WhitelabelConfig>) => void;
  zones: Zone[];
  automations: Automation[];
  inventory: InventoryItem[];
  buildMode: boolean;
  activeLiveWidget: Device | null;
  
  setBuildMode: (val: boolean) => void;
  setActiveLiveWidget: (device: Device | null) => void;
  
  updateDevice: (id: string, updates: Partial<Device>) => void;
  toggleDevice: (id: string) => void;
  addDeviceFromInventory: (catalogItem: any) => void;
  addStructuralDevice: (type: DeviceType) => void;
  addSite: (site: Site) => void;
  setActiveSite: (id: string) => void;
  addZone: (zone: Zone) => void;
  addAutomation: (auto: Automation) => void;
  removeAutomation: (id: string) => void;
  setZones: (zones: Zone[]) => void;
  isDrawingZone: boolean;
  setIsDrawingZone: (v: boolean) => void;
  currentZonePoints: [number, number][];
  setCurrentZonePoints: (pts: [number, number][]) => void;
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  removeDevice: (id: string) => void;
  
  changeInventory: (catalogId: string, delta: number) => void;
  
  saveToCloud: () => Promise<void>;
  isSaving: boolean;
  saveSuccess: boolean;
}

const AuraStoreContext = createContext<AuraStoreContextProps | undefined>(undefined);


let socket: Socket | null = null;
if (typeof window !== "undefined") {
  socket = io("http://localhost:4000");
}

export const AuraStoreProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [sites, setSites] = useState<Site[]>([{ id: "default_site", name: "A Minha Casa", type: "house" }]);
  const [activeSiteId, setActiveSiteId] = useState<string>("default_site");
  const [whitelabelConfig, setWhitelabelConfig] = useState<WhitelabelConfig>({
    isActive: false, companyName: "Aura OS", logoBase64: null, primaryColor: "#6366f1"
  });
  const [zones, setZones] = useState<Zone[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [buildMode, setBuildMode] = useState(false);
  const [activeLiveWidget, setActiveLiveWidget] = useState<Device | null>(null);
  const [isDrawingZone, setIsDrawingZone] = useState(false);
  const [currentZonePoints, setCurrentZonePoints] = useState<[number, number][]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
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
  }, []);

  const updateDevice = (id: string, updates: Partial<Device>) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const toggleDevice = (id: string) => {
    setDevices(prev => {
      const next = prev.map(d => d.id === id ? { ...d, isOn: !d.isOn } : d);
      localStorage.setItem("kira_cad_state", JSON.stringify(next));
      return next;
    });
  };

  const changeInventory = (catalogId: string, delta: number) => {
    setInventory(prev => {
      const existing = prev.find(i => i.catalogId === catalogId);
      let next;
      if (existing) {
        const newQ = Math.max(0, existing.quantity + delta);
        if (newQ === 0) next = prev.filter(i => i.catalogId !== catalogId);
        else next = prev.map(i => i.catalogId === catalogId ? { ...i, quantity: newQ } : i);
      } else {
        if (delta > 0) next = [...prev, { catalogId, quantity: delta }];
        else next = prev;
      }
      localStorage.setItem("kira_cad_inventory", JSON.stringify(next));
      return next;
    });
  };

  const addDeviceFromInventory = (catalogItem: any) => {
    const invItem = inventory.find(i => i.catalogId === catalogItem.id);
    if (!invItem || invItem.quantity <= 0) return;

    changeInventory(catalogItem.id, -1);

    const newDevice: Device = {
      id: Math.random().toString(),
      type: catalogItem.engine3dType,
      position: [(Math.random() - 0.5) * 4, 0, (Math.random() - 0.5) * 4],
      isOn: false,
      name: `${catalogItem.manufacturer} ${catalogItem.modelName}`,
      protocol: catalogItem.protocol
    };
    setDevices(prev => [...prev, { ...newDevice, siteId: activeSiteId }]);
  };

  const addAutomation = (auto: Automation) => {
    setAutomations(prev => [...prev, { ...auto, siteId: activeSiteId }]);
  };
  const removeAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
  };
  const addSite = (site: Site) => {
    setSites(prev => [...prev, site]);
    setActiveSiteId(site.id);
  };
  const updateWhitelabel = (updates: Partial<WhitelabelConfig>) => {
    setWhitelabelConfig(prev => ({ ...prev, ...updates }));
  };
  const setActiveSite = (id: string) => {
    setActiveSiteId(id);
  };
  const addZone = (zone: Zone) => {
    setZones(prev => [...prev, { ...zone, siteId: activeSiteId }]);
  };

  const removeDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };
  const addStructuralDevice = (type: DeviceType) => {
    const newDevice: Device = {
      id: Math.random().toString(),
      type,
      position: [(Math.random() - 0.5) * 4, 0, (Math.random() - 0.5) * 4],
      isOn: false,
    };
    setDevices(prev => [...prev, { ...newDevice, siteId: activeSiteId }]);
  };

  const saveToCloud = async () => {
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
  };

  return (
    <AuraStoreContext.Provider value={{
      devices: devices.filter(d => (d.siteId || "default_site") === activeSiteId),
      zones: zones.filter(z => (z.siteId || "default_site") === activeSiteId),
      automations: automations.filter(a => (a.siteId || "default_site") === activeSiteId),
      inventory, buildMode, activeLiveWidget, isDrawingZone, setIsDrawingZone, currentZonePoints, setCurrentZonePoints,
      setBuildMode, setActiveLiveWidget, updateDevice, toggleDevice, addDeviceFromInventory,
      addStructuralDevice, addZone, setZones, addAutomation, removeAutomation, setDevices, removeDevice, changeInventory, saveToCloud, isSaving, saveSuccess,
      sites, activeSiteId, addSite, setActiveSite, whitelabelConfig, updateWhitelabel
    }}>
      {children}
    </AuraStoreContext.Provider>
  );
};

export const useAuraStore = () => {
  const context = useContext(AuraStoreContext);
  if (context === undefined) throw new Error("useAuraStore must be used within a AuraStoreProvider");
  return context;
};
