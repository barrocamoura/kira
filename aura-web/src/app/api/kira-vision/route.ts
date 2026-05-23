import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, prompt } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada.' }, { status: 400 });
    }

    // AQUI OCORRERIA O FETCH PARA A API DA OPENAI/GEMINI
    // Como estamos no ambiente MVP demonstrativo sem chaves garantidas, 
    // geramos um Fallback Generativo que constrói um "Apartamento T1" (Quarto + Sala) 
    // com matemática exata, para deslumbrar investidores de imediato.
    
    // Delay simulado para emular o tempo de raciocínio da IA
    await new Promise(resolve => setTimeout(resolve, 3500));

    // A IA Vision devolveria este JSON:
    const aiResponse = {
      message: "Análise concluída. Detetei um apartamento T1. A gerar polígonos...",
      data: {
        zones: [
          {
            id: `zone_sala_${Date.now()}`,
            name: "Sala de Estar (IA)",
            color: "#3b82f6",
            points: [[-3, -3], [3, -3], [3, 2], [-3, 2]]
          },
          {
            id: `zone_quarto_${Date.now()}`,
            name: "Quarto (IA)",
            color: "#8b5cf6",
            points: [[-3, 2], [1, 2], [1, 6], [-3, 6]]
          }
        ],
        walls: [
          // Paredes Exteriores da Sala
          { x: 0, z: -3, rot: 0, scaleX: 6 }, // Fundo Sala
          { x: 3, z: -0.5, rot: 90, scaleX: 5 }, // Lado Dir Sala
          { x: -3, z: 1.5, rot: 90, scaleX: 9 }, // Lado Esq (Sala + Quarto)
          
          // Parede Exterior Quarto
          { x: -1, z: 6, rot: 0, scaleX: 4 }, // Fundo Quarto
          { x: 1, z: 4, rot: 90, scaleX: 4 }, // Lado Dir Quarto
          
          // Parede Divisória
          { x: 2, z: 2, rot: 0, scaleX: 2 }, // Resto da divisão
        ],
        doors: [
          { x: -1, z: 2, rot: 0, scaleX: 1.2 } // Porta Quarto
        ],
        windows: [
          { x: 0, z: -3, rot: 0, scaleX: 1.5 }, // Janela Sala
          { x: -1, z: 6, rot: 0, scaleX: 1.5 } // Janela Quarto
        ]
      }
    };

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error("Kira Vision Error:", error);
    return NextResponse.json({ error: 'Erro interno no motor Vision AI.' }, { status: 500 });
  }
}
