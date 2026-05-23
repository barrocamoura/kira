"use client";

import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, { 
  ReactFlowProvider, 
  addEdge, 
  useNodesState, 
  useEdgesState, 
  Controls, 
  Background, 
  Handle, 
  Position,
  Connection,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, Save, Network, Cpu, Zap, Activity } from 'lucide-react';
import { useAuraStore } from '@/store/useAuraStore';
import { supabase } from '@/lib/supabaseClient';

// ----------------------------------------------------
// CUSTOM NODES
// ----------------------------------------------------
const TriggerNode = ({ data }: any) => {
  return (
    <div className="bg-[#0f172a] border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] rounded-xl p-4 min-w-[200px]">
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-400" />
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-500/20 rounded-lg"><Activity className="w-4 h-4 text-blue-400"/></div>
        <div className="font-bold text-white text-sm">SENSOR (Gatilho)</div>
      </div>
      <div className="text-blue-200 text-xs">{data.label}</div>
    </div>
  );
};

const ActionNode = ({ data }: any) => {
  return (
    <div className="bg-[#0f172a] border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] rounded-xl p-4 min-w-[200px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-emerald-400" />
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-500/20 rounded-lg"><Zap className="w-4 h-4 text-emerald-400"/></div>
        <div className="font-bold text-white text-sm">AÇÃO (Atuador)</div>
      </div>
      <div className="text-emerald-200 text-xs">{data.label}</div>
    </div>
  );
};

const nodeTypes = {
  triggerNode: TriggerNode,
  actionNode: ActionNode,
};

// ----------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------
export default function AutomationsBuilder({ onClose, spaceId }: { onClose: () => void, spaceId?: string }) {
  const { devices, automations, addAutomation, removeAutomation } = useAuraStore();
  
  // Transformar automações existentes em Nodes e Edges
  const initialNodes: any[] = [];
  const initialEdges: any[] = [];
  
  let yOffset = 50;
  automations.forEach((auto, idx) => {
    const triggerDev = devices.find(d => d.id === auto.triggerDeviceId);
    const actionDev = devices.find(d => d.id === auto.actionDeviceId);
    
    if (triggerDev && actionDev) {
      const tId = `trigger_${auto.id}`;
      const aId = `action_${auto.id}`;
      
      initialNodes.push({
        id: tId,
        type: 'triggerNode',
        position: { x: 100, y: yOffset },
        data: { label: triggerDev.name || triggerDev.type, deviceId: triggerDev.id }
      });
      
      initialNodes.push({
        id: aId,
        type: 'actionNode',
        position: { x: 500, y: yOffset },
        data: { label: actionDev.name || actionDev.type, deviceId: actionDev.id }
      });
      
      initialEdges.push({
        id: `edge_${auto.id}`,
        source: tId,
        target: aId,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 }
      });
      
      yOffset += 150;
    }
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSaving, setIsSaving] = useState(false);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Drag & Drop do Menu para o Canvas
  const onDragStart = (event: React.DragEvent, nodeType: string, deviceData: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/deviceData', JSON.stringify(deviceData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const deviceStr = event.dataTransfer.getData('application/deviceData');

      if (typeof type === 'undefined' || !type || !deviceStr || !reactFlowInstance) {
        return;
      }

      const deviceData = JSON.parse(deviceStr);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}_${deviceData.id}_${Date.now()}`,
        type,
        position,
        data: { label: deviceData.name || deviceData.type, deviceId: deviceData.id },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Conectar Nós
  const onConnect = useCallback(async (params: Connection) => {
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);
    
    if (sourceNode && targetNode && sourceNode.type === 'triggerNode' && targetNode.type === 'actionNode') {
      // É uma conexão válida! Adicionar Edge visualmente
      const newEdge: Edge = {
        ...params,
        id: `edge_${Date.now()}`,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 }
      } as Edge;
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      // Perguntar nome da automação
      const autoName = window.prompt("Nomeie esta Automação (ex: Luzes Noturnas):", "Nova Automação");
      if (!autoName) return; // Cancelou
      
      setIsSaving(true);
      try {
        const newAuto = {
          space_id: spaceId,
          name: autoName,
          trigger_device_id: sourceNode.data.deviceId,
          trigger_condition: 'motion_detected', // Default mock
          action_device_id: targetNode.data.deviceId,
          action_command: 'turn_on' // Default mock
        };
        
        if (!supabase) throw new Error("Supabase client not initialized.");
        const { data, error } = await supabase.from('automations').insert(newAuto).select().single();
        if (error) throw error;
        
        // Update Local Store
        if (data) {
          addAutomation({
            id: data.id,
            name: data.name,
            triggerDeviceId: data.trigger_device_id,
            triggerCondition: data.trigger_condition,
            actionDeviceId: data.action_device_id,
            actionCommand: data.action_command
          });
        }
      } catch(err) {
        console.error("Erro a guardar automação:", err);
        alert("Erro a guardar a Automação.");
      }
      setIsSaving(false);
    } else {
      alert("Ligação Inválida! Ligue apenas Sensores a Atuadores.");
    }
  }, [nodes, setEdges, spaceId, addAutomation]);

  // Devices Filtrados
  const sensors = devices.filter(d => ["motion_sensor", "temp_sensor", "sofa_sensor", "smoke_sensor", "camera", "door_lock"].includes(d.type));
  const actuators = devices.filter(d => ["light", "ac", "smart_tv", "smart_blinds", "speaker", "smart_plug"].includes(d.type));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      
      <div className="bg-[#0f172a] border border-white/20 shadow-2xl rounded-3xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-black/60 p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Network className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Kira Engine</h2>
              <p className="text-indigo-400/80 text-xs sm:text-sm font-semibold tracking-wider uppercase">Blueprint Nodular - Arraste e Ligue</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-xl transition text-white/70 hover:text-white shrink-0 self-end sm:self-auto">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Sidebar Devices (Drag Source) */}
          <div className="w-full md:w-72 bg-black/40 border-r border-white/10 p-5 flex flex-col h-64 md:h-auto overflow-y-auto custom-scrollbar z-10 shrink-0">
            <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-4">Sensores (Gatilhos)</div>
            <div className="flex flex-col gap-2 mb-8">
              {sensors.map(s => (
                <div 
                  key={s.id} 
                  className="bg-blue-500/10 border border-blue-500/30 text-blue-300 p-3 rounded-xl cursor-grab active:cursor-grabbing hover:bg-blue-500/20 transition text-sm flex items-center gap-3"
                  onDragStart={(e) => onDragStart(e, 'triggerNode', s)}
                  draggable
                >
                  <Activity className="w-4 h-4 shrink-0" />
                  <span className="truncate">{s.name || s.type}</span>
                </div>
              ))}
              {sensors.length === 0 && <div className="text-white/30 text-xs italic">Nenhum sensor detetado no edifício.</div>}
            </div>

            <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-4">Atuadores (Ações)</div>
            <div className="flex flex-col gap-2">
              {actuators.map(a => (
                <div 
                  key={a.id} 
                  className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl cursor-grab active:cursor-grabbing hover:bg-emerald-500/20 transition text-sm flex items-center gap-3"
                  onDragStart={(e) => onDragStart(e, 'actionNode', a)}
                  draggable
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span className="truncate">{a.name || a.type}</span>
                </div>
              ))}
              {actuators.length === 0 && <div className="text-white/30 text-xs italic">Nenhum atuador detetado.</div>}
            </div>
          </div>

          {/* React Flow Canvas */}
          <div className="flex-1 h-full bg-[#0a0f1d] relative" ref={reactFlowWrapper}>
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                fitView
                className="w-full h-full"
                connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 3 }}
                defaultEdgeOptions={{ style: { stroke: '#6366f1', strokeWidth: 2 } }}
              >
                <Background color="#ffffff" gap={20} size={1} />
                <Controls className="bg-white/10 border-white/20 fill-white" />
              </ReactFlow>
            </ReactFlowProvider>
            
            {/* Overlay Saving */}
            {isSaving && (
              <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-3 animate-pulse shadow-lg shadow-indigo-500/50">
                  <Cpu className="w-5 h-5 animate-spin" /> A compilar Lógica Neural...
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
