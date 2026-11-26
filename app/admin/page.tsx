'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [text, setText] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('admin_unlocked') === 'true') {
      setUnlocked(true);
    }
  }, []);

  const checkPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    if (res.ok) {
      sessionStorage.setItem('admin_unlocked', 'true');
      setUnlocked(true);
    } else {
      alert('Noto‘g‘ri PIN-kod!');
    }
  };

  const runAI = async (mode: string) => {
    if (!text.trim()) {
      alert('Avval matn yoki mavzu yozing!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode, count: 5 }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        alert('Xatolik: ' + (data.error || 'Noma’lum xato'));
      } else {
        setList(data.questions || []);
      }
    } catch (err: any) {
      alert('Ulanish xatosi: ' + err.message);
    }
    setLoading(false);
  };

  const saveAll = async () => {
    if (list.length === 0) return;
    const { error } = await supabase.from('questions').insert(list);
    if (error) {
      alert('Bazaga saqlashda xato: ' + error.message);
    } else {
      alert('Bazaga muvaffaqiyatli saqlandi!');
      setList([]);
      setText('');
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <form onSubmit={checkPin} className="bg-white p-8 rounded-2xl shadow max-w-sm w-full space-y-4">
          <h1 className="text-xl font-bold text-center">Admin Panelga kirish</h1>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Maxfiy PIN-kodni kiriting"
            className="w-full border rounded-xl p-3 text-center text-lg tracking-widest"
          />
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">
            Kirish
          </button>
          <div className="text-center">
            <Link href="/" className="text-sm text-gray-500">Bosh sahifaga qaytish</Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex gap-4 items-center">
            <Link href="/" className="text-emerald-600 font-semibold">Bosh sahifa</Link>
            <button
              onClick={() => { sessionStorage.removeItem('admin_unlocked'); setUnlocked(false); }}
              className="text-sm text-red-600 font-semibold"
            >
              Qulflash
            </button>
          </div>
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
            {loading ? 'AI ishlamoqda...' : 'Matndan test ajratish'}
          </button>
          <button onClick={() => runAI('generate')} disabled={loading} className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold">
            {loading ? 'AI ishlamoqda...' : 'Kitobdan test tuzish'}
          </button>
        </div>

        {list.length > 0 && (
          <div className="mt-6 space-y-2">
            {list.map((q: any, i: number) => (
              <div key={i} className="p-3 border rounded-lg bg-gray-50">
                <p className="font-semibold">{i + 1}. {q.question_text}</p>
                <p className="text-sm text-emerald-700 mt-1">
                  To‘g‘ri javob: {(q.options || [])[q.correct_index]}
                </p>
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
