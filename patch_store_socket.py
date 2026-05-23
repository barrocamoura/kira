import os

filepath = "src/store/useAuraStore.tsx"
with open(filepath, "r") as f:
    content = f.read()

target_imports = """import { createContext, useContext, useState, useEffect, ReactNode } from "react";"""
replacement_imports = """import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";"""
content = content.replace(target_imports, replacement_imports)

# Global socket variable outside component
target_provider = """export const AuraStoreProvider = ({ children }: { children: ReactNode }) => {"""
replacement_provider = """
let socket: Socket | null = null;
if (typeof window !== "undefined") {
  socket = io("http://localhost:4000");
}

export const AuraStoreProvider = ({ children }: { children: ReactNode }) => {"""
content = content.replace(target_provider, replacement_provider)

# Inside provider, setup effect
target_cache = """const cachedSites = localStorage.getItem("kira_cad_sites");"""
replacement_cache = """
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
    const cachedSites = localStorage.getItem("kira_cad_sites");"""
content = content.replace(target_cache, replacement_cache)

# Modify toggleDevice
target_toggle = """  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => 
      d.id === id ? { ...d, isOn: !d.isOn } : d
    ));
  };"""
replacement_toggle = """  const toggleDevice = (id: string) => {
    // 1. Optimistic UI Update (zero latency perception)
    setDevices(prev => prev.map(d => 
      d.id === id ? { ...d, isOn: !d.isOn } : d
    ));
    // 2. Network Emission to Edge Node
    if (socket) {
      socket.emit("device:command", { id, command: "toggle" });
    }
  };"""
content = content.replace(target_toggle, replacement_toggle)

with open(filepath, "w") as f:
    f.write(content)
