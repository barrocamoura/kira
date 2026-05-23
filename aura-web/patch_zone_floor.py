import os

filepath = "src/components/Scene3D.tsx"
with open(filepath, "r") as f:
    content = f.read()

zone_floor_code = """
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

function WallModel"""

content = content.replace("function WallModel", zone_floor_code)

with open(filepath, "w") as f:
    f.write(content)
