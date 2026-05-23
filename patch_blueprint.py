import os

filepath = "src/components/Blueprint2D.tsx"
with open(filepath, "r") as f:
    content = f.read()

# 1. Imports
content = content.replace(
    'import { useAuraStore } from "@/store/useAuraStore";',
    'import { useAuraStore, Zone } from "@/store/useAuraStore";\nimport { Maximize, MousePointer2 } from "lucide-react";'
)

# 2. State setup
content = content.replace(
    'const { inventory, changeInventory } = useAuraStore();',
    'const { inventory, changeInventory, zones, addZone } = useAuraStore();\n  const [isDrawingZone, setIsDrawingZone] = useState(false);\n  const [currentZonePoints, setCurrentZonePoints] = useState<[number, number][]>([]);'
)

# 3. Handle Grid Click Replacement
old_click = """  const handleGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    
    const gridX = Math.round(cursorPt.x / GRID_SIZE) * GRID_SIZE;
    const gridY = Math.round(cursorPt.y / GRID_SIZE) * GRID_SIZE;
    
    const worldX = (gridX - (GRID_SIZE * 50) / 2) / 100;
    const worldZ = (gridY - (GRID_SIZE * 50) / 2) / 100;"""

new_click = """  const handleGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    
    const gridX = Math.round(cursorPt.x / GRID_SIZE) * GRID_SIZE;
    const gridY = Math.round(cursorPt.y / GRID_SIZE) * GRID_SIZE;
    
    const worldX = (gridX - (GRID_SIZE * 50) / 2) / 100;
    const worldZ = (gridY - (GRID_SIZE * 50) / 2) / 100;

    if (isDrawingZone) {
      if (currentZonePoints.length > 2) {
        const first = currentZonePoints[0];
        const dist = Math.hypot(worldX - first[0], worldZ - first[1]);
        if (dist < 0.5) { // Close polygon if near start
           const newZone: Zone = {
             id: Math.random().toString(),
             name: "Nova Divisão",
             points: currentZonePoints,
             color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"][Math.floor(Math.random() * 5)]
           };
           addZone(newZone);
           setCurrentZonePoints([]);
           setIsDrawingZone(false);
           return;
        }
      }
      setCurrentZonePoints([...currentZonePoints, [worldX, worldZ]]);
      return;
    }"""
content = content.replace(old_click, new_click)

# 4. Toolbar
old_toolbar = '<button onClick={() => addStructuralDevice("door")} className="px-3 py-1.5 bg-black/40 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition border border-white/5">Porta</button>'
new_toolbar = old_toolbar + """
          <button 
            onClick={() => { setIsDrawingZone(!isDrawingZone); setCurrentZonePoints([]); }} 
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${isDrawingZone ? "bg-indigo-600 text-white" : "bg-black/40 hover:bg-white/10 text-white border border-white/5"}`}
          >
            {isDrawingZone ? "Cancelar Zona" : <><Maximize className="w-3 h-3"/> Desenhar Divisão</>}
          </button>
"""
content = content.replace(old_toolbar, new_toolbar)

# 5. SVG Render
old_svg = '{/* Grid Lines */}'
new_svg = """{/* Zonas (Polígonos) */}
        {zones?.map(zone => {
          const pts = zone.points.map(p => `${(p[0] * 100) + (GRID_SIZE * 50) / 2},${(p[1] * 100) + (GRID_SIZE * 50) / 2}`).join(" ");
          return (
             <g key={zone.id}>
               <polygon points={pts} fill={zone.color} fillOpacity={0.15} stroke={zone.color} strokeWidth={2} strokeDasharray="4 4" />
               <text x={(zone.points[0][0] * 100) + (GRID_SIZE * 50) / 2 + 10} y={(zone.points[0][1] * 100) + (GRID_SIZE * 50) / 2 + 20} fill={zone.color} fontSize="12" fontWeight="bold">
                 {zone.name}
               </text>
             </g>
          );
        })}

        {/* Zona sendo desenhada */}
        {isDrawingZone && currentZonePoints.length > 0 && (
           <polyline 
             points={currentZonePoints.map(p => `${(p[0] * 100) + (GRID_SIZE * 50) / 2},${(p[1] * 100) + (GRID_SIZE * 50) / 2}`).join(" ")} 
             fill="none" 
             stroke="#6366f1" 
             strokeWidth={2} 
           />
        )}
        {isDrawingZone && currentZonePoints.map((p, i) => (
           <circle key={i} cx={(p[0] * 100) + (GRID_SIZE * 50) / 2} cy={(p[1] * 100) + (GRID_SIZE * 50) / 2} r={4} fill="#6366f1" />
        ))}

        {/* Grid Lines */}"""
content = content.replace(old_svg, new_svg)

with open(filepath, "w") as f:
    f.write(content)
