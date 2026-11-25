import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const { text, mode, count = 5 } = await req.json();
    const key = process.env.GEMINI_API_KEY;
    if (!key) return NextResponse.json({ error: 'GEMINI_API_KEY kiritilmagan' }, { status: 500 });
    const prompt = mode === 'parse'
      ? `Quyidagi matndan test savollarini ajratib oling va faqat JSON massiv shaklida qaytaring: [{"question_text":"...","options":["A","B","C","D"],"correct_index":0,"explanation":"..."}]. Matn: \n${text}`
      : `Quyidagi mavzu bo'yicha ${count} ta ozbek tilida attestatsiya test savoli tuzing va faqat JSON massiv shaklida qaytaring: [{"question_text":"...","options":["A","B","C","D"],"correct_index":0,"explanation":"..."}]. Mazmun: \n${text}`;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });
    const d = await r.json();
    const raw = d.candidates?>[0]?.content?.parts?>[0]?.text || '[]';
    const parsed = JSON.parse(raw);
    return NextResponse.json({ questions: Array.isArray(parsed) ? parsed : parsed.questions || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
