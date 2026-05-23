const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const addDeviceFunc = `
  const addDevice = (type: DeviceType) => {
    const newDevice = {
      id: Math.random().toString(),
      type,
      position: [(Math.random() - 0.5) * 4, 0, (Math.random() - 0.5) * 4],
      isOn: false
    };
    setDevices(prev => [...prev, newDevice]);
  };
`;
code = code.replace(/const updateDevicePos = [\s\S]*?\};/m, match => match + '
' + addDeviceFunc);

const aiParser = `
  const handleKiraGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kiraPrompt.trim()) return;
    setIsKiraGenerating(true);
    setTimeout(() => {
      const promptLower = kiraPrompt.toLowerCase();
      const count = (regex) => {
        const match = promptLower.match(regex);
        return match ? parseInt(match[1]) : 0;
      };
      const wallsCount = count(/(\d+)\s*parede/) || (promptLower.includes('parede') ? 1 : 0);
      const lightsCount = count(/(\d+)\s*l[aâ]mpada/) || count(/(\d+)\s*luz/) || (promptLower.includes('luz') || promptLower.includes('lâmpada') ? 1 : 0);
      const winCount = count(/(\d+)\s*janela/) || (promptLower.includes('janela') ? 1 : 0);
      const solarCount = count(/(\d+)\s*painel/) || count(/(\d+)\s*placa/) || (promptLower.includes('painel') ? 1 : 0);
      const sofaCount = count(/(\d+)\s*sof[aá]/) || (promptLower.includes('sofá') ? 1 : 0);

      const generated = [];
      for (let i = 0; i < wallsCount; i++) generated.push({ id: 'gen_w_'+i, type: 'wall', position: [-3 + (i * 2.5), 0, -3], isOn: false });
      for (let i = 0; i < lightsCount; i++) generated.push({ id: 'gen_l_'+i, type: 'light', position: [-1.5 + (i * 2), 2.5, 0], isOn: false });
      for (let i = 0; i < winCount; i++) generated.push({ id: 'gen_win_'+i, type: 'window', position: [0 + (i * 2), 0, 3], isOn: false });
      for (let i = 0; i < solarCount; i++) generated.push({ id: 'gen_sol_'+i, type: 'solar_panel', position: [3, 0, -3 + (i * 2)], isOn: false });
      for (let i = 0; i < sofaCount; i++) generated.push({ id: 'gen_sof_'+i, type: 'sofa_sensor', position: [0, 0, 1 + (i * 2)], isOn: false });

      if (generated.length > 0) setDevices(generated);
      setIsKiraGenerating(false);
      setKiraPrompt('');
    }, 1500);
  };
`;
code = code.replace(/const handleKiraGenerate = [\s\S]*?2500\);
  \};/m, aiParser);

const toolbar = `
        <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-2">
            <div className="backdrop-blur-md px-4 py-2 rounded-xl border text-sm font-semibold transition-colors w-fit ${buildMode ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-black/50 border-white/10 text-white'}">
              Kira Architect: {buildMode ? 'MODO CONSTRUÇÃO' : 'MODO VISUALIZAÇÃO'}
            </div>
            {buildMode && (
              <div className="flex bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-2xl pointer-events-auto">
                <button onClick={() => addDevice('wall')} className="flex flex-col items-center gap-1 hover:bg-white/10 p-2 rounded-lg text-xs text-white/70 transition w-16"> Parede </button>
                <button onClick={() => addDevice('window')} className="flex flex-col items-center gap-1 hover:bg-white/10 p-2 rounded-lg text-xs text-white/70 transition w-16"> Janela </button>
                <button onClick={() => addDevice('solar_panel')} className="flex flex-col items-center gap-1 hover:bg-white/10 p-2 rounded-lg text-xs text-white/70 transition w-16"> Painel </button>
                <button onClick={() => addDevice('light')} className="flex flex-col items-center gap-1 hover:bg-white/10 p-2 rounded-lg text-xs text-white/70 transition w-16"> Luz </button>
                <button onClick={() => addDevice('sofa_sensor')} className="flex flex-col items-center gap-1 hover:bg-white/10 p-2 rounded-lg text-xs text-white/70 transition w-16"> Sofá </button>
              </div>
            )}
          </div>
          <button onClick={() => setBuildMode(!buildMode)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition pointer-events-auto">
            {buildMode ? 'Salvar Configuração' : 'Ativar Construtor'}
          </button>
        </div>
`;
code = code.replace(/<div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">[\s\S]*?Kira Architect'\}
\s*<\/button>
\s*<\/div>/, toolbar);

fs.writeFileSync('src/app/dashboard/page.tsx', code);

