import { useEffect, useState } from 'react';
import { Shuffle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export default function ExamBListPage() {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/exams/hang-b`)
      .then(r => r.json())
      .then(res => setVariants(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white font-body text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-24">
        <h1 className="font-display text-3xl mb-6">Thi thử hạng B - 30 câu (20 phút)</h1>
        <p className="text-slate-700 mb-8">Cấu trúc: 30 câu trong 600 câu, gồm 08 Khái niệm và quy tắc; 01 điểm liệt; 01 Văn hóa, đạo đức; 01 Kỹ thuật lái xe; 01 Cấu tạo & sửa chữa; 09 Biển báo; 09 Sa hình. Đạt: 27/30 và không sai câu điểm liệt.</p>

        {loading ? (
          <div>Đang tải danh sách đề…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {variants.filter(v => v.id !== 'random').map(v => (
              <Link key={v.id} to={`/lythuyet/hang-b/de/${v.id}`} className="group block p-5 rounded-xl border border-slate-200 bg-white hover:shadow transition">
                <div className="font-heading text-lg mb-2">{v.label}</div>
                <div className="text-sm text-slate-600">30 câu • 20 phút • đạt 27/30</div>
                <div className="mt-4 inline-flex items-center gap-2 text-slate-900 group-hover:gap-3">
                  Bắt đầu <ChevronRight className="w-4 h-4"/>
                </div>
              </Link>
            ))}

            {/* Random */}
            <Link to={`/lythuyet/hang-b/de/random`} className="group block p-5 rounded-xl border border-slate-200 bg-white hover:shadow transition">
              <div className="font-heading text-lg mb-2 flex items-center gap-2"><Shuffle className="w-5 h-5"/> Đề ngẫu nhiên</div>
              <div className="text-sm text-slate-600">30 câu • 20 phút • đạt 27/30</div>
              <div className="mt-4 inline-flex items-center gap-2 text-slate-900 group-hover:gap-3">
                Bắt đầu <ChevronRight className="w-4 h-4"/>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

