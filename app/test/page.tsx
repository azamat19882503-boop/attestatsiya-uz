'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function TestPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      const { data } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setQuestions(data);
      }
      setLoading(false);
    }
    loadQuestions();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg font-semibold">Savollar yuklanmoqda...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-xl font-bold">Hozircha bazada savollar yo‘q</p>
        <Link href="/admin" className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold">Admin Paneldan savol qo‘shish</Link>
      </div>
    );
  }

  const current = questions[index];

  const handleAnswer = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    if (optIdx === current.correct_index) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-2">Test yakunlandi!</h2>
          <p className="text-lg text-gray-700 mb-6">
            Natija: <span className="font-bold text-emerald-600">{score}</span> / {questions.length}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setIndex(0); setScore(0); setSelected(null); setFinished(false); }} className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold">
              Qayta ishlash
            </button>
            <Link href="/" className="bg-gray-200 px-5 py-3 rounded-xl font-bold">Bosh sahifa</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold text-gray-500">Savol {index + 1} / {questions.length}</span>
          <Link href="/" className="text-emerald-600 font-semibold">Chiqish</Link>
        </div>

        <h2 className="text-xl font-bold mb-6">{current.question_text}</h2>

        <div className="space-y-3">
          {(current.options || []).map((opt: string, i: number) => {
            let style = 'border-gray-200 hover:bg-gray-50';
            if (selected !== null) {
              if (i === current.correct_index) style = 'bg-emerald-100 border-emerald-600 text-emerald-900 font-semibold';
              else if (i === selected) style = 'bg-red-100 border-red-600 text-red-900';
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left p-4 border-2 rounded-xl transition ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && current.explanation && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-900">
            <strong>Izoh:</strong> {current.explanation}
          </div>
        )}

        {selected !== null && (
          <button onClick={nextQuestion} className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">
            {index + 1 < questions.length ? 'Keyingi savol' : 'Natijani ko‘rish'}
          </button>
        )}
      </div>
    </div>
  );
}
