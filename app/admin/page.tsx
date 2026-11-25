'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  const [text, setText] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const runAI = async (mode: string) => {
    setLoading(true);
    const res = await fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({ text, mode, count: 5 }),
    });
    const data = await res.json();
    setList(data.questions || []);
    setLoading(false);
  };

  const saveAll = async () => {
    if (list.length === 0) return;
    await supabase.from('questions').insert(list);
    alert('Bazaga saqlandi!');
    setList([]);
    setText('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Link href="/" className="text-emerald-600 font-semibold">Bosh sahifa</Link>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Test yoki darslik matnini shu yerga tashlang..."
          className="w-full border rounded-xl p-4 mb-4"
        />

        <div className="flex gap-3">
          <button onClick={() => runAI('parse')} disabled={loading} className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold">
            {loading ? 'Kuting...' : 'Matndan test ajratish'}
          </button>
          <button onClick={() => runAI('generate')} disabled={loading} className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold">
            Kitobdan test tuzish
          </button>
        </div>

        {list.length > 0 && (
          <div className="mt-6 space-y-2">
            {list.map((q: any, i: number) => (
              <div key={i} className="p-3 border rounded-lg bg-gray-50">
                <p className="font-semibold">{i + 1}. {q.question_text}</p>
              </div>
            ))}
            <button onClick={saveAll} className="mt-4 bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold">
              Bazaga saqlash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}