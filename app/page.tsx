import Link from 'next/link';

export default function Home() {
  const topTeachers = [
    { name: 'Dilnoza Karimova', region: 'Samarqand', score: 980 },
    { name: 'Bobur Toshmatov', region: 'Toshkent', score: 945 },
    { name: 'Malika Alimova', region: 'Navoiy', score: 910 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-xl text-emerald-600">Attestatsiya.uz</span>
        <div className="flex gap-6 font-medium text-gray-700">
          <Link href="/test" className="hover:text-emerald-600">Testlar</Link>
          <Link href="/cards" className="hover:text-emerald-600">3D Kartochkalar</Link>
          <Link href="/mistakes" className="hover:text-emerald-600">Xatolarim</Link>
          <Link href="/admin" className="hover:text-emerald-600">Admin Panel</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="bg-emerald-600 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Davlat attestatsiyasiga onlayn tayyorlaning</h1>
            <p className="text-emerald-100">Imtihon va mashq rejimlari, 3D kartochkalar va xatolar ustida ishlash tizimi.</p>
          </div>
          <Link href="/test" className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold whitespace-nowrap">
            Testni boshlash
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">3 daqiqalik mini-sinov</span>
            <h2 className="text-xl font-bold mt-3 mb-2">Kunlik 5 ta tezkor savol</h2>
            <p className="text-sm text-gray-600 mb-4">Har kuni 5 ta savol yechib, haftalik reytingda yuqori orinlarga chiqing.</p>
            <Link href="/test" className="inline-block bg-emerald-600 text-white px-5 py-2 rounded-xl font-semibold">
              Hozir yechish
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Haftalik Top Ustozlar</h2>
            <div className="space-y-3">
              {topTeachers.map((u, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-bold text-emerald-600 mr-2">#{i + 1}</span>
                    <span className="font-medium">{u.name}</span>{' '}
                    <span className="text-xs text-gray-400">({u.region})</span>
                  </div>
                  <span className="font-bold text-gray-800">{u.score} ball</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}