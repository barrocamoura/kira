import os

filepath = "src/components/Blueprint2D.tsx"
with open(filepath, "r") as f:
    content = f.read()

pip_function = """
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
"""

target = "const handlePointerUp = () => {"
replacement = pip_function + "\n  const handlePointerUp = () => {\n    if (draggingId) {\n      const device = devices.find(d => d.id === draggingId);\n      if (device) {\n        let foundZoneId = null;\n        for (const zone of zones) {\n          if (isPointInPolygon([device.position[0], device.position[2]], zone.points)) {\n            foundZoneId = zone.id;\n            break;\n          }\n        }\n        onUpdateDevice(draggingId, { zoneId: foundZoneId });\n      }\n    }"
content = content.replace(target, replacement)

# Now update the Inspector to show the Zone
inspector_target = '<div className="flex flex-col gap-1">'
inspector_replacement = """
          <div className="flex flex-col gap-1">
            <label className="text-xs text-emerald-400 uppercase font-semibold">Localização Inteligente (IA)</label>
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg px-3 py-2 text-sm font-bold truncate">
              {selectedDevice.zoneId ? (zones.find(z => z.id === selectedDevice.zoneId)?.name || "Desconhecida") : "Área Geral"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
"""
content = content.replace(inspector_target, inspector_replacement, 1)

with open(filepath, "w") as f:
    f.write(content)
