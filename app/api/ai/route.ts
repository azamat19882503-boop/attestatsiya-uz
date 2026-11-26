import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, mode, count = 5 } = await req.json();
    const key = (process.env.GEMINI_API_KEY || '').trim();
    if (!key) {
      return NextResponse.json({ error: 'Vercelda GEMINI_API_KEY topilmadi!' }, { status: 500 });
    }

    const prompt =
      mode === 'parse'
        ? `Quyidagi matndan test savollarini ajratib oling va faqat JSON massiv shaklida qaytaring: [{"question_text":"...","options":["A","B","C","D"],"correct_index":0,"explanation":"..."}]. Matn:\n${text}`
        : `Quyidagi mavzu bo'yicha ${count} ta o'zbek tilida attestatsiya test savoli tuzing va faqat JSON massiv shaklida qaytaring: [{"question_text":"...","options":["A","B","C","D"],"correct_index":0,"explanation":"..."}]. Mavzu:\n${text}`;

    const res = await fetch(
      `https://googleapis.com{key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || 'Gemini API xatosi' }, { status: 500 });
    }

    const raw = data.candidates?.?.content?.parts?.?.text || '[]';
    const parsed = JSON.parse(raw);
    return NextResponse.json({ questions: Array.isArray(parsed) ? parsed : parsed.questions || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.cause?.message || e.message }, { status: 500 });
  }
}
