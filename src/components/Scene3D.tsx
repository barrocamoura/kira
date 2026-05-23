
"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, ContactShadows, Text, Box, Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";

export type DeviceType = 
  | "wall" | "window" | "door" // Estrutura
  | "solar_panel" | "electrical_panel" | "smart_plug" // Energia
  | "ac" | "washing_machine" | "dishwasher" | "fridge" | "smart_tv" | "smart_blinds" // Conforto/Eletro
  | "light" | "sofa_sensor" | "motion_sensor" | "smoke_sensor" | "temp_sensor" | "speaker" | "camera" | "door_lock" | "thermostat"; // Sensores

export type Device = {
  id: string;
  type: DeviceType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  isOn: boolean;
  name?: string;
  protocol?: "Matter" | "Zigbee" | "Wi-Fi" | "KNX" | "Unconfigured";
  address?: string;
  siteId?: string;
  zoneId?: string;
};

interface DeviceProps {
  device: Device;
  buildMode: boolean;
  onToggle: (id: string) => void;
}

// ==========================================
// 1. ESTRUTURA
// ==========================================

function ZoneFloorModel({ zone }: { zone: any }) {
  const shape = React.useMemo(() => {
    const s = new THREE.Shape();
    if (zone.points && zone.points.length > 0) {
      s.moveTo(zone.points[0][0], -zone.points[0][1]); // 3D mapped: x is x, z is -y in 2D Shape
      for (let i = 1; i < zone.points.length; i++) {
        s.lineTo(zone.points[i][0], -zone.points[i][1]);
      }
      s.lineTo(zone.points[0][0], -zone.points[0][1]);
    } else {
      s.moveTo(0, 0);
    }
    return s;
  }, [zone.points]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={zone.color} opacity={0.6} transparent roughness={0.8} />
    </mesh>
  );
}

function WallModel({ device }: { device: Device }) {
  const scaleX = device.scale ? device.scale[0] : 2.5;
  const scaleZ = device.scale ? device.scale[2] : 0.2;
  return (
    <Box args={[scaleX, 2.5, scaleZ]} position={[0, 1.25, 0]}>
      <meshStandardMaterial color="#e5e7eb" roughness={0.8} />
    </Box>
  );
}

function WindowModel({ device }: { device: Device }) {
  const scaleX = device.scale ? device.scale[0] : 1.5;
  return (
    <group position={[0, 1.25, 0]}>
      <Box args={[scaleX, 1.5, 0.25]}>
        <meshStandardMaterial color="#1f2937" />
      </Box>
      <Box args={[scaleX - 0.1, 1.4, 0.1]}>
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} roughness={0.1} ior={1.5} />
      </Box>
    </group>
  );
}

function DoorModel({ device }: { device: Device }) {
  const scaleX = device.scale ? device.scale[0] : 1.2;
  return (
    <group position={[0, 1.0, 0]}>
      <Box args={[scaleX, 2.0, 0.15]}>
        <meshStandardMaterial color="#8b5a2b" roughness={0.7} />
      </Box>
      <mesh position={[scaleX / 2 - 0.15, 0, 0.1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ==========================================
// 2. ENERGIA
// ==========================================
function SolarPanelModel() {
  return (
    <group position={[0, 0.5, 0]} rotation={[Math.PI / 6, 0, 0]}>
      <Box args={[2, 0.05, 3]}>
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </Box>
      <Grid args={[2, 3]} position={[0, 0.03, 0]} rotation={[Math.PI/2, 0, 0]} cellColor="#1d4ed8" sectionColor="#1e3a8a" />
      <Cylinder args={[0.05, 0.05, 1]} position={[0, -0.5, -1]} rotation={[-Math.PI / 6, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Cylinder>
    </group>
  );
}

function ElectricalPanelModel({ isOn }: { isOn: boolean }) {
  return (
    <group position={[0, 1.5, 0]}>
      <Box args={[0.8, 1.2, 0.2]}>
        <meshStandardMaterial color="#d1d5db" roughness={0.5} metalness={0.5} />
      </Box>
      <Box args={[0.7, 1.1, 0.05]} position={[0, 0, 0.1]}>
        <meshStandardMaterial color="#9ca3af" />
      </Box>
      <mesh position={[0, 0.4, 0.15]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={isOn ? "#10b981" : "#ef4444"} emissive={isOn ? "#10b981" : "#ef4444"} emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function SmartPlugModel({ isOn }: { isOn: boolean }) {
  return (
    <group position={[0, 0.3, 0]}>
      <Box args={[0.2, 0.2, 0.1]}>
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </Box>
      <mesh position={[0, 0, 0.06]}>
        <circleGeometry args={[0.05, 32]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0.07, 0.07, 0.05]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color={isOn ? "#3b82f6" : "#6b7280"} emissive={isOn ? "#3b82f6" : "#000"} />
      </mesh>
    </group>
  );
}

// ==========================================
// 3. ELETRODOMÉSTICOS & CONFORTO
// ==========================================
function ACModel({ device }: { device: Device }) {
  return (
    <group position={[0, 2.2, 0]}>
      <Box args={[1.5, 0.4, 0.3]}>
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </Box>
      {device.isOn && (
        <Box args={[1.3, 0.05, 0.2]} position={[0, -0.15, 0.1]}>
          <meshBasicMaterial color="#3b82f6" opacity={0.5} transparent />
        </Box>
      )}
    </group>
  );
}

function WashingMachineModel({ isOn }: { isOn: boolean }) {
  return (
    <group position={[0, 0.45, 0]}>
      <Box args={[0.9, 0.9, 0.9]}>
        <meshStandardMaterial color="#f3f4f6" roughness={0.4} />
      </Box>
      <Cylinder args={[0.3, 0.3, 0.05, 32]} position={[0, 0, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder args={[0.25, 0.25, 0.02, 32]} position={[0, 0, 0.48]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color={isOn ? "#60a5fa" : "#374151"} transmission={isOn ? 0.5 : 0.1} opacity={1} roughness={0.2} />
      </Cylinder>
    </group>
  );
}

function DishwasherModel({ isOn }: { isOn: boolean }) {
  return (
    <group position={[0, 0.45, 0]}>
      <Box args={[0.9, 0.9, 0.8]}>
        <meshStandardMaterial color="#e5e7eb" roughness={0.5} metalness={0.2} />
      </Box>
      <Box args={[0.9, 0.15, 0.05]} position={[0, 0.35, 0.4]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      <mesh position={[0.3, 0.35, 0.43]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={isOn ? "#10b981" : "#4b5563"} emissive={isOn ? "#10b981" : "#000"} />
      </mesh>
    </group>
  );
}

function FridgeModel() {
  return (
    <group position={[0, 1.0, 0]}>
      <Box args={[1.0, 2.0, 1.0]}>
        <meshStandardMaterial color="#d1d5db" metalness={0.6} roughness={0.3} />
      </Box>
      <Box args={[0.05, 0.8, 0.05]} position={[0.4, -0.3, 0.52]}>
        <meshStandardMaterial color="#9ca3af" metalness={0.8} />
      </Box>
      <Box args={[0.05, 0.4, 0.05]} position={[0.4, 0.6, 0.52]}>
        <meshStandardMaterial color="#9ca3af" metalness={0.8} />
      </Box>
      <Box args={[0.3, 0.4, 0.02]} position={[-0.2, 0.5, 0.51]}>
        <meshStandardMaterial color="#000000" />
      </Box>
    </group>
  );
}

function SmartTVModel({ isOn }: { isOn: boolean }) {
  return (
    <group position={[0, 1.2, 0.1]}>
      <Box args={[2.0, 1.2, 0.05]}>
        <meshStandardMaterial color="#111827" />
      </Box>
      <Box args={[1.9, 1.1, 0.02]} position={[0, 0, 0.03]}>
        <meshStandardMaterial color={isOn ? "#ffffff" : "#000000"} emissive={isOn ? "#2563eb" : "#000000"} emissiveIntensity={isOn ? 0.5 : 0} />
      </Box>
    </group>
  );
}

function SmartBlindsModel({ isOn }: { isOn: boolean }) {
  // isOn = Fechado (Desce a cortina)
  return (
    <group position={[0, 2.2, 0.2]}>
      <Box args={[2.0, 0.15, 0.15]}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </Box>
      <Box args={[1.9, isOn ? 1.8 : 0.2, 0.02]} position={[0, isOn ? -0.9 : -0.1, 0]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
    </group>
  );
}

// ==========================================
// 4. SENSORES
// ==========================================
function MotionSensorModel({ isOn }: { isOn: boolean }) {
  return (
    <group position={[0, 2.4, 0]}>
      <Sphere args={[0.1, 32, 32]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </Sphere>
      {isOn && (
        <mesh position={[0, -0.05, 0]}>
          <coneGeometry args={[1.5, 2, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.1} />
        </mesh>
      )}
    </group>
  );
}

function SmokeSensorModel({ isOn }: { isOn: boolean }) {
  return (
    <group position={[0, 2.45, 0]}>
      <Cylinder args={[0.2, 0.2, 0.1, 32]}>
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </Cylinder>
      <mesh position={[0, -0.06, 0]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={isOn ? "#ef4444" : "#10b981"} emissive={isOn ? "#ef4444" : "#10b981"} />
      </mesh>
    </group>
  );
}

function TempSensorModel() {
  return (
    <group position={[0, 1.5, 0.1]}>
      <Box args={[0.15, 0.25, 0.05]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Text position={[0, 0, 0.03]} fontSize={0.06} color="#1f2937">23°C</Text>
    </group>
  );
}

function SofaSensorModel({ isOn }: { isOn: boolean }) {
  return (
    <group position={[0, 0.3, 0]}>
      <Box args={[1.8, 0.6, 1.0]}>
        <meshStandardMaterial color={isOn ? "#3b82f6" : "#475569"} roughness={0.9} />
      </Box>
      <Text position={[0, 0.4, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.15} color="white">
        {isOn ? "Sensor Pressão: ATIVO" : "Sensor Pressão: VAZIO"}
      </Text>
    </group>
  );
}

function SpeakerModel() {
  return (
    <group position={[0, 0.5, 0]}>
      <Cylinder args={[0.15, 0.15, 0.4, 32]}>
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </Cylinder>
      <Cylinder args={[0.16, 0.16, 0.05, 32]} position={[0, 0.18, 0]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
    </group>
  );
}

function CameraModel({ isOn }: { isOn: boolean }) {
  return (
    <group position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 4]}>
      <Cylinder args={[0.08, 0.08, 0.2, 32]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </Cylinder>
      <Sphere args={[0.06, 32, 32]} position={[0, 0, 0.1]}>
        <meshStandardMaterial color="#111827" roughness={0.1} />
      </Sphere>
      <mesh position={[0, 0.05, 0.15]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color={isOn ? "#ef4444" : "#4b5563"} emissive={isOn ? "#ef4444" : "#000"} />
      </mesh>
    </group>
  );
}

function DoorLockModel({ isOn }: { isOn: boolean }) {
  return (
    <group position={[0, 1.0, 0.15]}>
      <Box args={[0.1, 0.3, 0.05]}>
        <meshStandardMaterial color="#1f2937" metalness={0.8} />
      </Box>
      <Cylinder args={[0.03, 0.03, 0.02, 32]} position={[0, 0.05, 0.03]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="#9ca3af" />
      </Cylinder>
      <mesh position={[0, -0.05, 0.03]}>
        <circleGeometry args={[0.02, 16]} />
        <meshStandardMaterial color={isOn ? "#10b981" : "#ef4444"} emissive={isOn ? "#10b981" : "#ef4444"} />
      </mesh>
    </group>
  );
}

function ThermostatModel() {
  return (
    <group position={[0, 1.5, 0.1]}>
      <Cylinder args={[0.1, 0.1, 0.05, 32]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </Cylinder>
      <mesh position={[0, 0, 0.03]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <Text position={[0, 0, 0.04]} fontSize={0.05} color="#3b82f6">22°C</Text>
    </group>
  );
}

function LightModel({ isOn }: { isOn: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (isOn && lightRef.current) lightRef.current.intensity = 1.5 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
    else if (lightRef.current) lightRef.current.intensity = 0;
  });

  return (
    <group>
      <pointLight ref={lightRef} distance={5} color={isOn ? "#fbbf24" : "#ffffff"} />
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={isOn ? "#fde68a" : "#4b5563"} emissive={isOn ? "#fbbf24" : "#000000"} emissiveIntensity={isOn ? 2 : 0} />
      </mesh>
    </group>
  );
}

// ==========================================
// RENDERIZADOR UNIVERSAL
// ==========================================

function DeviceRenderer({ device, buildMode, onToggle, setActiveLiveWidget }: DeviceProps & { setActiveLiveWidget: any }) {
  // Use the new aura store to set the active widget
  

  const getModel = () => {
    switch(device.type) {
      case "wall": return <WallModel device={device} />;
      case "window": return <WindowModel device={device} />;
      case "door": return <DoorModel device={device} />;
      
      case "solar_panel": return <SolarPanelModel />;
      case "electrical_panel": return <ElectricalPanelModel isOn={device.isOn} />;
      case "smart_plug": return <SmartPlugModel isOn={device.isOn} />;

      case "ac": return <ACModel device={device} />;
      case "washing_machine": return <WashingMachineModel isOn={device.isOn} />;
      case "dishwasher": return <DishwasherModel isOn={device.isOn} />;
      case "fridge": return <FridgeModel />;
      case "smart_tv": return <SmartTVModel isOn={device.isOn} />;
      case "smart_blinds": return <SmartBlindsModel isOn={device.isOn} />;

      case "light": return <LightModel isOn={device.isOn} />;
      case "sofa_sensor": return <SofaSensorModel isOn={device.isOn} />;
      case "motion_sensor": return <MotionSensorModel isOn={device.isOn} />;
      case "smoke_sensor": return <SmokeSensorModel isOn={device.isOn} />;
      case "temp_sensor": return <TempSensorModel />;
      case "speaker": return <SpeakerModel />;
      case "camera": return <CameraModel isOn={device.isOn} />;
      case "door_lock": return <DoorLockModel isOn={device.isOn} />;
      case "thermostat": return <ThermostatModel />;
      
      default: return <Box><meshStandardMaterial color="red" /></Box>;
    }
  };

  const isInteractive = !["wall", "window", "door", "solar_panel", "fridge", "temp_sensor"].includes(device.type);

  return (
    <group 
      position={device.position}
      rotation={device.rotation || [0, 0, 0]}
      onClick={(e) => {
        if (!buildMode && isInteractive) {
          e.stopPropagation();
          // onToggle(device.id); // Old basic toggle
          setActiveLiveWidget(device); // Open Monumental Live Widget
        }
      }}
      onPointerOver={() => !buildMode && isInteractive && (document.body.style.cursor = "pointer")}
      onPointerOut={() => !buildMode && isInteractive && (document.body.style.cursor = "default")}
    >
      {getModel()}
    </group>
  );
}

interface Scene3DProps {
  buildMode: boolean;
  devices: Device[];
  onToggleDevice: (id: string) => void;
  setActiveLiveWidget: (device: any) => void;
  zones?: any[];
}

export default function Scene3D({ buildMode, devices, onToggleDevice, setActiveLiveWidget, zones }: Scene3DProps) {
  return (
    <div className="w-full h-full min-h-[500px] bg-black rounded-b-3xl">
      <Canvas camera={{ position: [8, 8, 8], fov: 45 }}>
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.05} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Environment preset="city" />

        <Grid 
          infiniteGrid 
          fadeDistance={40} 
          sectionColor={buildMode ? "#312e81" : "#1e3a8a"}
          cellColor={buildMode ? "#1e1b4b" : "#0f172a"} 
          position={[0, -0.01, 0]} 
        />

        <ContactShadows resolution={512} scale={20} blur={2} opacity={0.5} far={10} />

        {zones?.map((zone) => (
          <ZoneFloorModel key={zone.id} zone={zone} />
        ))}
        {devices.map((device) => (
          <DeviceRenderer 
            key={device.id} 
            device={device} 
            buildMode={buildMode} 
            onToggle={onToggleDevice}
            setActiveLiveWidget={setActiveLiveWidget}
          />
        ))}

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="#050505" />
        </mesh>
      </Canvas>
    </div>
  );
}
