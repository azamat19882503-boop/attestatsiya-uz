import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { text, mode, count = 5 } = await req.json();
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt =
      mode === 'parse'
        ? `Quyidagi matndan test savollarini ajratib oling va faqat JSON massiv shaklida qaytaring (question_text, options, correct_index, explanation): \n${text}`
        : `Quyidagi mavzu bo'yicha ${count} ta o'zbek tilida attestatsiya test savoli tuzing va faqat JSON massiv shaklida qaytaring (question_text, options, correct_index, explanation): \n${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '[]');
    return NextResponse.json({ questions: Array.isArray(parsed) ? parsed : parsed.questions || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
