import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Info } from 'lucide-react';

export default function TheoryPracticePage() {
  // Categories from backend
  const [categories, setCategories] = useState([{ id: null, name: 'Tất cả', question_count: 0 }]);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const activeCategory = categories[activeCategoryIdx] || { id: null, name: 'Tất cả', question_count: 0 };

  // Questions loaded from backend
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [current, setCurrent] = useState(1);
  const [answers, setAnswers] = useState({}); // { [qId]: idx }



  const API_ROOT_URL = (import.meta.env.VITE_BACKEND_URL || '') + '/api';
  const API_BASE = API_ROOT_URL + '/v1';

  // Fetch categories on mount
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then(r => r.json())
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setCategories([{ id: null, name: 'Tất cả', question_count: 0 }, ...data]);
      })
      .catch(() => setCategories([{ id: null, name: 'Tất cả', question_count: 0 }]));
  }, [API_BASE]);

  // Fetch questions when category changes
  useEffect(() => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (activeCategory?.id) params.set('category_id', activeCategory.id);
    params.set('limit', '600');
    fetch(`${API_BASE}/questions?${params.toString()}`)
      .then(r => r.json())
      .then(res => {
        setQuestions(res.data || []);
        setCurrent(1);
        setAnswers({});
      })
      .catch((e) => setError('Không tải được câu hỏi'))
      .finally(() => setLoading(false));
  }, [activeCategoryIdx]);

  const q = questions[current - 1] || null;

  const bgStyle = {
    background: '#ffffff'
  };

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;


  const handleChoose = (idx) => {
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: idx }));
  };

  const tileState = (id) => {
    const selected = answers[id];
    if (selected !== undefined) {
      const isCorrect = questions[id - 1]?.correctIndex === selected;
      return isCorrect ? 'correct' : 'wrong';
    }
    return 'neutral';
  };

  return (
    <div className="min-h-screen w-full font-body text-slate-900" style={bgStyle}>
      <div className="max-w-7xl mx-auto px-4 py-24">
        {/* Top tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((c, idx) => (
            <button
              key={c.id ?? idx}
              onClick={() => setActiveCategoryIdx(idx)}
              className={`px-4 py-2 rounded-full text-sm font-heading border transition-all ${idx === activeCategoryIdx ? 'bg-yellow-400 text-slate-900 border-yellow-500 shadow' : 'bg-white/70 text-slate-800 border-slate-200 hover:bg-white'}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Ghi chú trạng thái */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-body text-slate-800 mb-4">
          <div className="flex items-center gap-2"><Info className="w-4 h-4" /> Chọn đáp án để hiện kết quả ngay.</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-green-500 inline-block" /> Đúng</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-rose-500 inline-block" /> Sai</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-slate-300 inline-block" /> Đã trả lời</div>
          <div className="ml-auto flex items-center gap-3">
            <span>Đã trả lời: {answeredCount}/{total}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: numbers */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 font-heading text-slate-900">{activeCategory?.name || 'Danh mục'}: {total} câu</div>
              <div className="max-h-[70vh] overflow-y-auto p-3 scrollbar-white">
                <div className="grid grid-cols-9 gap-2">
                  {questions.map((item, idx) => {
                    const qid = item.id; // hiển thị theo số câu thật từ CSDL
                    const st = tileState(qid);
                    const isActive = current === idx + 1;
                    const cls = st === 'correct' ? 'bg-green-500 text-white' : st === 'wrong' ? 'bg-rose-500 text-white' : st === 'answered' ? 'bg-slate-300 text-slate-900' : 'bg-white text-slate-700 border-slate-300';
                    return (
                      <button key={qid} onClick={() => setCurrent(idx + 1)} className={`h-9 rounded-md border text-xs font-medium hover:shadow transition ${cls} ${isActive ? 'ring-2 ring-slate-900' : ''}`}>
                        {qid}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: question */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white/85 backdrop-blur rounded-2xl border border-slate-200 shadow">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                <div className="font-heading text-slate-950 text-lg">Câu hỏi {q?.id ?? current}</div>
                <div className="flex items-center gap-2">
                  <button disabled={current === 1} onClick={() => setCurrent(c => Math.max(1, c - 1))} className="px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Câu trước</button>
                  <button disabled={current === total || total === 0} onClick={() => setCurrent(c => Math.min(total, c + 1))} className="px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">Câu sau <ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="text-slate-700">Đang tải câu hỏi...</div>
                ) : !q ? (
                  <div className="text-slate-700">Không có câu hỏi cho danh mục này.</div>
                ) : (
                  <div className="space-y-4 min-h-[520px]">
                    <div className="font-display text-lg text-slate-900">{q.text}</div>
                    {q.image_url && (
                      <div className="w-full rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <img src={q.image_url} alt="minh họa" className="max-h-[340px] w-full object-contain bg-white" />
                      </div>
                    )}
                    <div className="space-y-2">
                      {(q.options || []).map((opt, idx) => {
                        const selectedIdx = answers[q.id];
                        const hasAnswered = selectedIdx !== undefined;
                        const isCorrect = q.correctIndex === idx;
                        const isSelectedWrong = hasAnswered && selectedIdx === idx && selectedIdx !== q.correctIndex;
                        let stateClass = 'bg-white hover:bg-slate-50 border-slate-200';
                        if (hasAnswered) {
                          if (isCorrect) stateClass = 'bg-green-50 border-green-500';
                          else if (isSelectedWrong) stateClass = 'bg-rose-50 border-rose-500';
                        }
                        return (
                          <button
                            key={idx}
                            onClick={() => handleChoose(idx)}
                            className={`w-full text-left px-4 py-3 rounded-md border transition flex items-center gap-3 ${stateClass}`}
                          >
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-900 text-white text-xs">{idx + 1}</span>
                            <span className="font-body text-slate-800">{opt}</span>
                            {hasAnswered && isCorrect && <CheckCircle2 className="ml-auto w-5 h-5 text-green-600" />}
                            {isSelectedWrong && <XCircle className="ml-auto w-5 h-5 text-rose-600" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Giải thích */}
                    {answers[q.id] !== undefined && (
                      <div className="mt-3 rounded-md border border-slate-200 bg-white p-4">
                        <div className="font-heading text-slate-900 mb-1">Giải thích</div>
                        <div className="text-slate-700 whitespace-pre-line">{q.explanation || 'Chưa có giải thích cho câu hỏi này.'}</div>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <button disabled={current === 1} onClick={() => setCurrent(c => Math.max(1, c - 1))} className="px-4 py-2 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Câu trước</button>
                      <button disabled={current === total || total === 0} onClick={() => setCurrent(c => Math.min(total, c + 1))} className="px-4 py-2 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">Câu sau <ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

