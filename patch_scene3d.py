import os

filepath = "src/components/Scene3D.tsx"
with open(filepath, "r") as f:
    content = f.read()

# 1. Import Zone and Shape
content = content.replace(
    'import { Canvas } from "@react-three/fiber";',
    'import { Canvas } from "@react-three/fiber";\nimport * as THREE from "three";'
)

# 2. Add ZoneFloorModel
zone_floor_code = """
function ZoneFloorModel({ zone }: { zone: any }) {
  const shape = React.useMemo(() => {
    const s = new THREE.Shape();
    if (zone.points.length > 0) {
      s.moveTo(zone.points[0][0], -zone.points[0][1]); // 3D mapped: x is x, z is -y in 2D Shape
      for (let i = 1; i < zone.points.length; i++) {
        s.lineTo(zone.points[i][0], -zone.points[i][1]);
      }
      s.lineTo(zone.points[0][0], -zone.points[0][1]);
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
"""

content = content.replace("function LightModel() {", zone_floor_code + "\nfunction LightModel() {")

# 3. Inside SceneContent, get zones from store
target = "const { setActiveLiveWidget } = require(\"@/store/useAuraStore\").useAuraStore();"
replacement = "const { setActiveLiveWidget, zones } = require(\"@/store/useAuraStore\").useAuraStore();"
content = content.replace(target, replacement)

# 4. Render Zones
target_render = "{devices.map(device => ("
replacement_render = """{zones?.map(zone => (
        <ZoneFloorModel key={zone.id} zone={zone} />
      ))}
      {devices.map(device => ("""
content = content.replace(target_render, replacement_render)

with open(filepath, "w") as f:
    f.write(content)
