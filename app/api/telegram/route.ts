import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
    if (!token) return NextResponse.json({ ok: true });

    const body = await req.json();
    const msg = body.message;
    if (!msg || !msg.text) return NextResponse.json({ ok: true });

    const chatId = msg.chat.id;
    const text = msg.text.trim();
    const api = `https://telegram.org{token}`;

    const sendMsg = async (txt: string, reply_markup?: any) => {
      await fetch(`${api}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: txt, reply_markup }),
      });
    };

    if (text === '/start') {
      await sendMsg(
        `Assalomu alaykum, ${msg.from?.first_name || 'ustoz'}!\n\nAttestatsiya.uz rasmiy botiga xush kelibsiz.\n\nBuyruqlar:\n/test — Bazadan tasodifiy savol yechish\n/sayt — To‘liq platformani ochish`,
        {
          keyboard: [[{ text: '/test' }, { text: '/sayt' }]],
          resize_keyboard: true,
        }
      );
      return NextResponse.json({ ok: true });
    }

    if (text === '/sayt') {
      await sendMsg('To‘liq onlayn testlar va 3D kartochkalar platformasi:', {
        inline_keyboard: [[{ text: 'Saytni ochish (Attestatsiya.uz)', url: 'https://vercel.app' }]],
      });
      return NextResponse.json({ ok: true });
    }

    if (text === '/test') {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase.from('questions').select('*');

      if (!data || data.length === 0) {
        await sendMsg('Hozircha bazada savollar yo‘q. Admin panel orqali savol qo‘shing.');
        return NextResponse.json({ ok: true });
      }

      const q = data[Math.floor(Math.random() * data.length)];
      const options = (q.options || []).slice(0, 4).map((o: string) => o.slice(0, 95));

      await fetch(`${api}/sendPoll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          question: q.question_text.slice(0, 290),
          options,
          type: 'quiz',
          correct_option_id: q.correct_index || 0,
          explanation: (q.explanation || '').slice(0, 190),
          is_anonymous: false,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
