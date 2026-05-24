import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, prompt } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chave da API Gemini não configurada na Vercel.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Usar o modelo Flash que é ultra-rápido e suporta imagens
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extrair o cabeçalho base64 (ex: data:image/jpeg;base64,...)
    let base64Data = imageBase64;
    let mimeType = 'image/jpeg'; // Default
    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      mimeType = parts[0].replace('data:', '');
      base64Data = parts[1];
    }

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ];

    // System prompt altamente restrito para forçar JSON e extração arquitetural
    const systemInstruction = `
      És a 'Kira Vision', uma IA de visão computacional especializada em engenharia civil e domótica.
      O utilizador enviou uma imagem de uma divisão, planta ou objeto.
      O teu objetivo é analisar e extrair a geometria 3D básica.
      DEVES RESPONDER ESTRITAMENTE EM FORMATO JSON, SEM MARCAÇÃO MARKDOWN.
      Formato exigido:
      {
        "message": "Mensagem descritiva do que detetaste na imagem",
        "data": {
          "zones": [
            { "id": "zone_X", "name": "Nome da Zona", "color": "#hex", "points": [[-3, -3], [3, -3], [3, 2], [-3, 2]] }
          ],
          "walls": [
            { "x": 0, "z": 0, "rot": 0, "scaleX": 5 }
          ],
          "doors": [],
          "windows": []
        }
      }
      Se não conseguires detetar polígonos exatos, inventa polígonos lógicos baseados na imagem.
    `;

    const result = await model.generateContent([systemInstruction, prompt || "Analise a imagem", ...imageParts]);
    const responseText = result.response.text();
    
    // Limpar o markdown JSON caso a Gemini devolva com ```json ... ```
    let cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsed = JSON.parse(cleanJson);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("Gemini não devolveu um JSON válido:", cleanJson);
      return NextResponse.json({ error: 'Erro a interpretar geometria neural (Não-JSON).' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Kira Vision Error:", error);
    return NextResponse.json({ error: error.message || 'Erro interno no motor Vision AI.' }, { status: 500 });
  }
}
