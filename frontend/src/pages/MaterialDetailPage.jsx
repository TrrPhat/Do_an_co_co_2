import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export default function MaterialDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/v1/materials/${id}`)
      .then(r => r.json())
      .then(res => {
        if (res.error) { setError(res.error); return; }
        setData(res.data);
        setRelated(res.related || []);
      })
      .catch(() => setError('Không tải được tài liệu'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-white font-body text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-24">
        {loading ? (
          <div>Đang tải…</div>
        ) : error ? (
          <div className="text-rose-600">{error}</div>
        ) : !data ? (
          <div className="text-slate-600">Không tìm thấy tài liệu.</div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-600 mb-2">{data.material_type}</div>
              <h1 className="font-display text-3xl">{data.title}</h1>
              <div className="text-slate-500 text-sm mt-1">{new Date(data.created_at).toLocaleDateString()}</div>
            </div>

            {data.image_url && (
              <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                <img src={data.image_url} alt="cover" className="w-full h-auto object-cover" />
              </div>
            )}

            <div className="whitespace-pre-line leading-relaxed text-slate-800">{data.content}</div>

            {related.length > 0 && (
              <div className="pt-8 border-t border-slate-200">
                <h2 className="font-heading text-xl mb-4">Tài liệu liên quan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {related.map(it => (
                    <Link key={it.id} to={`/tailieu/${it.id}`} className="rounded-xl border border-slate-200 bg-white hover:shadow transition overflow-hidden">
                      {it.image_url && (
                        <div className="h-36 w-full bg-slate-100 overflow-hidden">
                          <img src={it.image_url} alt="thumb" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3">
                        <div className="font-heading line-clamp-2">{it.title}</div>
                        <div className="text-xs text-slate-500 mt-1">{new Date(it.created_at).toLocaleDateString()}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

