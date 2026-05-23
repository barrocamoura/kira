"use client";
import React, { useState, useRef } from "react";
import { Device } from "./Scene3D";
import { RotateCw, Expand, Shrink, Settings2, X, Save, Wifi, Cpu, Link as LinkIcon, Trash2 } from "lucide-react";
import { useAuraStore } from "@/store/useAuraStore";

interface BlueprintProps {
  devices: Device[];
  onUpdateDevice: (id: string, updates: Partial<Device>) => void;
}

export default function Blueprint2D({ devices, onUpdateDevice }: BlueprintProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const { zones, removeDevice } = useAuraStore();
  const isDraggingMap = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Constants
  const GRID_SIZE = 40; 
  const CENTER_X = 300; 
  const CENTER_Y = 300; 

  
  const handleMapPointerDown = (e: React.PointerEvent) => {
    isDraggingMap.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleMapPointerMove = (e: React.PointerEvent) => {
    if (isDraggingMap.current) {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      setCamera(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastMouse.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMapPointerUp = () => {
    isDraggingMap.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.001;
    setCamera(prev => ({ ...prev, zoom: Math.min(Math.max(0.5, prev.zoom + zoomDelta), 3) }));
  };

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setDraggingId(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - CENTER_X - camera.x) / camera.zoom;
    const y = (e.clientY - rect.top - CENTER_Y - camera.y) / camera.zoom;
    
    const snap3D = 0.5;
    const snappedX = Math.round((x / GRID_SIZE) / snap3D) * snap3D;
    const snappedY = Math.round((y / GRID_SIZE) / snap3D) * snap3D;

    onUpdateDevice(draggingId, { position: [snappedX, 0, snappedY] });
  };

  
  // Algoritmo de Ray Casting (Point in Polygon)
  const isPointInPolygon = (point: [number, number], vs: [number, number][]) => {
    let x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i][0], yi = vs[i][1];
        let xj = vs[j][0], yj = vs[j][1];
        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
  };

  const handlePointerUp = () => {
    if (draggingId) {
      const device = devices.find(d => d.id === draggingId);
      if (device) {
        let foundZoneId: string | undefined = undefined;
        for (const zone of zones) {
          if (isPointInPolygon([device.position[0], device.position[2]], zone.points)) {
            foundZoneId = zone.id;
            break;
          }
        }
        onUpdateDevice(draggingId, { zoneId: foundZoneId });
      }
    }
    setDraggingId(null);
  };

  const rotateSelected = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedId) return;
    const device = devices.find(d => d.id === selectedId);
    if (!device) return;
    const currentRot = device.rotation ? device.rotation[1] : 0;
    onUpdateDevice(selectedId, { rotation: [0, currentRot + Math.PI / 2, 0] });
  };

  const scaleSelected = (e: React.PointerEvent | React.MouseEvent, dx: number, dz: number) => {
    e.stopPropagation();
    if (!selectedId) return;
    const device = devices.find(d => d.id === selectedId);
    if (!device) return;
    const currentScale = device.scale || [2.5, 2.5, 0.2];
    onUpdateDevice(selectedId, { scale: [Math.max(0.5, currentScale[0] + dx), 2.5, Math.max(0.2, currentScale[2] + dz)] });
  };

  const selectedDevice = devices.find(d => d.id === selectedId);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-[#0f172a] relative overflow-hidden rounded-2xl border border-white/10"
      onPointerMove={(e) => { handlePointerMove(e); handleMapPointerMove(e); }}
      onPointerDown={handleMapPointerDown}
      onPointerUp={(e) => { handlePointerUp(); handleMapPointerUp(); }}
      onPointerLeave={(e) => { handlePointerUp(); handleMapPointerUp(); }}
      onWheel={handleWheel}
      onClick={() => { setSelectedId(null); setInspectorOpen(false); }}
      
    >
      
      <div style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`, transformOrigin: "center", width: "100%", height: "100%" }}>
      <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 opacity-30 border-t border-l border-white" />

      {devices.map(device => {
        const x = CENTER_X + (device.position[0] * GRID_SIZE);
        const y = CENTER_Y + (device.position[2] * GRID_SIZE);
        const isSelected = selectedId === device.id;
        const rotDegree = (device.rotation ? device.rotation[1] : 0) * (180 / Math.PI);
        
        let width = 20;
        let height = 20;
        let bgColor = "bg-blue-500";
        let label = device.name || "";
        let isStructural = false;

        switch(device.type) {
          case "wall": width = (device.scale ? device.scale[0] : 2.5) * GRID_SIZE; height = (device.scale ? device.scale[2] : 0.2) * GRID_SIZE; bgColor = "bg-gray-400"; label = label || "Parede"; isStructural = true; break;
          case "window": width = (device.scale ? device.scale[0] : 1.5) * GRID_SIZE; height = 0.25 * GRID_SIZE; bgColor = "bg-cyan-400/80 border border-cyan-200"; label = label || "Janela"; isStructural = true; break;
          case "door": width = (device.scale ? device.scale[0] : 1.2) * GRID_SIZE; height = 0.15 * GRID_SIZE; bgColor = "bg-amber-700 border border-amber-500"; label = label || "Porta"; isStructural = true; break;
          
          case "electrical_panel": width = 0.8 * GRID_SIZE; height = 0.2 * GRID_SIZE; bgColor = "bg-red-700 text-white border-2 border-red-500"; label = label || "Quadro Elétrico"; break;
          case "solar_panel": width = 2 * GRID_SIZE; height = 3 * GRID_SIZE; bgColor = "bg-blue-800 border border-blue-400"; label = label || "Painel Solar"; break;
          case "smart_plug": width = 15; height = 15; bgColor = "bg-green-500 rounded-full border-2 border-white"; label = label || "Tomada"; break;

          case "washing_machine": width = 0.9 * GRID_SIZE; height = 0.9 * GRID_SIZE; bgColor = "bg-slate-200 text-slate-800 border-2 border-slate-400 rounded-md"; label = label || "Máquina Lavar"; break;
          case "dishwasher": width = 0.9 * GRID_SIZE; height = 0.8 * GRID_SIZE; bgColor = "bg-slate-300 text-slate-800 border border-slate-500 rounded-md"; label = label || "Lava Louça"; break;
          case "fridge": width = 1.0 * GRID_SIZE; height = 1.0 * GRID_SIZE; bgColor = "bg-gray-400 text-white rounded-md"; label = label || "Frigorífico"; break;
          case "smart_tv": width = 2.0 * GRID_SIZE; height = 0.1 * GRID_SIZE; bgColor = "bg-black text-white border border-gray-600"; label = label || "Smart TV"; break;
          case "ac": width = 1.5 * GRID_SIZE; height = 0.3 * GRID_SIZE; bgColor = "bg-gray-100 border border-gray-300 text-gray-800"; label = label || "Ar Condicionado"; break;
          case "smart_blinds": width = 2.0 * GRID_SIZE; height = 0.15 * GRID_SIZE; bgColor = "bg-stone-200 text-stone-800"; label = label || "Estores Int."; break;

          case "light": width = 20; height = 20; bgColor = "bg-yellow-400 rounded-full"; label = label || "Luz"; break;
          case "sofa_sensor": width = 1.8 * GRID_SIZE; height = 1.0 * GRID_SIZE; bgColor = "bg-purple-500/80 border border-purple-300 rounded-md"; label = label || "Sofá Sensor"; break;
          case "motion_sensor": width = 25; height = 25; bgColor = "bg-rose-500 rounded-full text-white font-bold border border-rose-300"; label = label || "M"; break;
          case "smoke_sensor": width = 25; height = 25; bgColor = "bg-orange-500 rounded-full text-white"; label = label || "F"; break;
          case "temp_sensor": width = 20; height = 15; bgColor = "bg-teal-500 text-white text-[8px]"; label = label || "T/H"; break;
          case "speaker": width = 18; height = 18; bgColor = "bg-indigo-600 rounded-full text-white"; label = label || "Som"; break;
          case "camera": width = 20; height = 15; bgColor = "bg-red-600/80 text-white border border-red-400"; label = label || "CAM"; break;
          case "door_lock": width = 12; height = 25; bgColor = "bg-slate-700 text-white border border-slate-500"; label = label || "Lock"; break;
          case "thermostat": width = 20; height = 20; bgColor = "bg-zinc-800 rounded-full text-blue-400 border border-blue-500/50"; label = label || "22°"; break;
        }

        return (
          <div
            key={device.id}
            onPointerDown={(e) => handlePointerDown(e, device.id)}
            onDoubleClick={(e) => { e.stopPropagation(); setInspectorOpen(true); }}
            className={`absolute flex items-center justify-center text-[9px] font-bold text-white/90 cursor-move shadow-lg transition-shadow select-none
              ${bgColor} 
              ${isSelected ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0f172a] z-20" : "z-10 hover:ring-1 hover:ring-white/50"}
            `}
            style={{
              width, 
              height,
              left: x, 
              top: y,
              transform: `translate(-50%, -50%) rotate(${rotDegree}deg)`,
            }}
          >
            <span className="whitespace-nowrap px-1 overflow-hidden truncate max-w-full" style={{ transform: `rotate(${-rotDegree}deg)` }}>
              {device.type === "light" ? "💡" : label}
            </span>

            {isSelected && !inspectorOpen && (
              <div 
                onPointerDown={(e) => e.stopPropagation()} 
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md rounded-lg p-1.5 flex gap-2 border border-white/20 shadow-2xl z-30 cursor-default"
                style={{ transform: `rotate(${-rotDegree}deg)` }}
              >
                <button onPointerDown={(e) => rotateSelected(e)} onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-white/20 rounded text-white flex items-center gap-1" title="Rodar 90º">
                  <RotateCw className="w-4 h-4" />
                </button>
                {isStructural && (
                  <>
                    <div className="w-px h-full bg-white/20 mx-1" />
                    <button onPointerDown={(e) => scaleSelected(e, 0.5, 0)} onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-white/20 rounded text-emerald-400 flex items-center gap-1" title="Aumentar">
                      <Expand className="w-4 h-4" />
                    </button>
                    <button onPointerDown={(e) => scaleSelected(e, -0.5, 0)} onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-white/20 rounded text-red-400 flex items-center gap-1" title="Diminuir">
                      <Shrink className="w-4 h-4" />
                    </button>
                  </>
                )}
                <div className="w-px h-full bg-white/20 mx-1" />
                <button onPointerDown={(e) => { e.stopPropagation(); setInspectorOpen(true); }} className="p-1 hover:bg-white/20 rounded text-blue-400 flex items-center gap-1" title="Configurar">
                  <Settings2 className="w-4 h-4" />
                </button>
                <div className="w-px h-full bg-white/20 mx-1" />
                <button onPointerDown={(e) => { e.stopPropagation(); removeDevice(device.id); setInspectorOpen(false); }} className="p-1 hover:bg-white/20 rounded text-red-400 flex items-center gap-1" title="Apagar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}

      </div>
      {/* Painel Inspetor */}
      {inspectorOpen && selectedDevice && (
        <div 
          className="absolute top-4 right-4 w-72 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl z-50 flex flex-col gap-4 text-white"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold flex items-center gap-2"><Cpu className="w-5 h-5 text-indigo-400" /> Inspetor</h3>
            <button onClick={() => setInspectorOpen(false)} className="hover:bg-white/10 p-1 rounded-md"><X className="w-4 h-4" /></button>
          </div>

          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-emerald-400 uppercase font-semibold">Localização Inteligente (IA)</label>
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg px-3 py-2 text-sm font-bold truncate">
              {selectedDevice.zoneId ? (zones.find(z => z.id === selectedDevice.zoneId)?.name || "Desconhecida") : "Área Geral"}
            </div>
          </div>
          <div className="flex flex-col gap-1">

            <label className="text-xs text-white/50 uppercase font-semibold">Nome / ID</label>
            <input 
              type="text" 
              value={selectedDevice.name || ""} 
              placeholder={`Ex: ${selectedDevice.type}`}
              onChange={(e) => onUpdateDevice(selectedDevice.id, { name: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {!["wall", "window", "door"].includes(selectedDevice.type) && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/50 uppercase font-semibold flex items-center gap-1"><LinkIcon className="w-3 h-3" /> Protocolo Matter / IoT</label>
                <select 
                  value={selectedDevice.protocol || "Unconfigured"}
                  onChange={(e) => onUpdateDevice(selectedDevice.id, { protocol: e.target.value as any })}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 appearance-none"
                >
                  <option value="Unconfigured">Não Configurado</option>
                  <option value="Matter">Matter (Universal)</option>
                  <option value="Zigbee">Zigbee</option>
                  <option value="Wi-Fi">Wi-Fi (IP)</option>
                  <option value="KNX">KNX Integrado</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/50 uppercase font-semibold flex items-center gap-1"><Wifi className="w-3 h-3" /> Endereço IP / Token</label>
                <input 
                  type="text" 
                  value={selectedDevice.address || ""} 
                  placeholder="192.168.X.X ou MAC"
                  onChange={(e) => onUpdateDevice(selectedDevice.id, { address: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-lg flex gap-2">
            <Save className="w-4 h-4 shrink-0" /> Salvo no Cache Local. Clique &apos;Salvar & Concluir&apos; para enviar à Nuvem.
          </div>
        </div>
      )}
    </div>
  );
}