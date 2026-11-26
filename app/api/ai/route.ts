import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { text, mode, count = 5 } = await req.json();
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY topilmadi!' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt =
      mode === 'parse'
        ? `Quyidagi matndan test savollarini ajratib oling va faqat JSON massiv shaklida qaytaring: [{"question_text":"...","options":["A","B","C","D"],"correct_index":0,"explanation":"..."}]. Matn:\n${text}`
        : `Quyidagi mavzu bo'yicha ${count} ta o'zbek tilida attestatsiya test savoli tuzing va faqat JSON massiv shaklida qaytaring: [{"question_text":"...","options":["A","B","C","D"],"correct_index":0,"explanation":"..."}]. Mavzu:\n${text}`;

    const models = ['gemini-3-flash-preview', 'gemini-2.5-flash', 'gemini-2.0-flash'];
    let responseText = '';
    let lastError = '';

    for (const model of models) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        if (res.text) {
          responseText = res.text;
          break;
        }
      } catch (err: any) {
        lastError = err.message || String(err);
      }
    }

    if (!responseText) {
      return NextResponse.json({ error: 'AI javob bermadi: ' + lastError }, { status: 500 });
    }

    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions || [];

    if (questions.length === 0) {
      return NextResponse.json({ error: 'AI bo‘sh ro‘yxat qaytardi: ' + cleanJson.slice(0, 100) }, { status: 500 });
    }

    return NextResponse.json({ questions });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
