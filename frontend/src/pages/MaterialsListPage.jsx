import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

const TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'tip', label: 'Mẹo' },
  { key: 'experience', label: 'Kinh nghiệm' },
  { key: 'law', label: 'Luật' },
  { key: 'technique', label: 'Kỹ thuật' },
];

export default function MaterialsListPage() {
  const [params, setParams] = useSearchParams();
  const type = params.get('type') || '';
  const page = parseInt(params.get('page') || '1', 10);
  const q = params.get('q') || '';

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total_pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  function setParam(next) {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') p.delete(k);
      else p.set(k, String(v));
    });
    setParams(p, { replace: true });
  }

  useEffect(() => {
    setLoading(true);
    const url = new URL(`${API_BASE}/api/v1/materials`);
    if (type) url.searchParams.set('type', type);
    if (q) url.searchParams.set('q', q);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', '12');
    fetch(url.toString())
      .then(r => r.json())
      .then(res => {
        setItems(res.data || []);
        setMeta(res.meta || { page: 1, total_pages: 1, total: 0 });
      })
      .finally(() => setLoading(false));
  }, [type, page, q]);

  return (
    <div className="min-h-screen bg-white font-body text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-24">
        <h1 className="font-display text-3xl mb-6">Tài liệu ôn thi</h1>
        <p className="text-slate-600 mb-6">Tổng hợp mẹo, kỹ thuật, luật, và kinh nghiệm lái xe.</p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {TABS.map(t => (
            <button
              key={t.key || 'all'}
              onClick={() => setParam({ type: t.key, page: 1 })}
              className={`px-4 py-2 rounded-full text-sm font-heading border transition ${
                (type === t.key || (!type && t.key === ''))
                  ? 'bg-yellow-400 text-slate-900 border-yellow-500 shadow'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-lg">
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Tìm kiếm tài liệu..."
              defaultValue={q}
              onKeyDown={e => {
                if (e.key === 'Enter') setParam({ q: e.currentTarget.value, page: 1 });
              }}
            />
            <Search className="w-5 h-5 text-slate-500 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div>Đang tải...</div>
        ) : items.length === 0 ? (
          <div className="text-slate-600">Chưa có tài liệu phù hợp.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(it => (
              <Link key={it.id} to={`/tailieu/${it.id}`} className="rounded-xl border border-slate-200 bg-white hover:shadow transition overflow-hidden">
                {it.image_url && (
                  <div className="h-40 w-full bg-slate-100 overflow-hidden">
                    <img src={it.image_url} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-600 mb-1">{it.material_type}</div>
                  <div className="font-heading text-lg mb-1 line-clamp-2">{it.title}</div>
                  <div className="text-slate-600 text-sm line-clamp-3">{it.excerpt}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            disabled={meta.page <= 1}
            onClick={() => setParam({ page: Math.max(1, meta.page - 1) })}
            className="px-3 py-1.5 rounded-md border bg-white disabled:opacity-50"
          >
            Trước
          </button>
          <div className="text-sm text-slate-700">Trang {meta.page}/{meta.total_pages || 1}</div>
          <button
            disabled={meta.page >= (meta.total_pages || 1)}
            onClick={() => setParam({ page: meta.page + 1 })}
            className="px-3 py-1.5 rounded-md border bg-white disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

