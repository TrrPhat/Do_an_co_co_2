import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AlarmClock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export default function ExamBPage() {
  const { variant } = useParams();
  const nav = useNavigate();

  const [exam, setExam] = useState(null); // { meta, liability_question_ids, questions }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [current, setCurrent] = useState(1);
  const [answers, setAnswers] = useState({}); // { [qid]: idx }
  const [remaining, setRemaining] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null); // {score, pass, wrongLiability}

  const total = exam?.questions?.length || 0;

  useEffect(() => {
    setLoading(true);
    setError('');
    const url = new URL(`${API_BASE}/api/v1/exams/hang-b/generate`);
    if (variant === 'random') url.searchParams.set('random', '1');
    else url.searchParams.set('variant', String(variant ?? '1'));
    fetch(url.toString())
      .then(r => r.json())
      .then(data => {
        setExam(data);
        setRemaining(data?.meta?.time_limit ?? 20*60);
        setCurrent(1);
        setAnswers({});
        setSubmitted(false);
        setResult(null);
      })
      .catch(() => setError('Không tải được đề thi'))
      .finally(() => setLoading(false));
  }, [variant]);

  // Timer
  useEffect(() => {
    if (!exam || submitted) return;
    if (remaining <= 0) { doSubmit(); return; }
    const t = setTimeout(() => setRemaining(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, exam, submitted]);

  const q = useMemo(() => exam?.questions?.[current-1] ?? null, [exam, current]);

  const handleChoose = (idx) => {
    if (submitted || !q) return;
    setAnswers(prev => ({ ...prev, [q.id]: idx }));
  }

  function doSubmit() {
    if (!exam || submitted) return;
    const qs = exam.questions;
    let score = 0;
    let wrongLiability = false;
    for (const item of qs) {
      const sel = answers[item.id];
      if (sel === item.correctIndex) score += 1;
      if (item.is_liability && sel !== item.correctIndex) wrongLiability = true;
    }
    const pass = score >= 27 && !wrongLiability;
    setResult({ score, pass, wrongLiability });
    setSubmitted(true);
  }

  const timeText = `${String(Math.floor((remaining||0)/60)).padStart(2,'0')}:${String((remaining||0)%60).padStart(2,'0')}`;

  return (
    <div className="min-h-screen bg-white font-body text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl">Thi thử hạng B - 30 câu</h1>
            <div className="text-slate-600 text-sm">Thời gian 20 phút • Đạt 27/30 • Sai 1 câu điểm liệt là KHÔNG ĐẠT</div>
          </div>
          <div className="flex items-center gap-3">
            <AlarmClock className="w-5 h-5" /> <span className="font-heading">{timeText}</span>
            {!submitted && (
              <button onClick={doSubmit} className="ml-4 px-4 py-2 rounded-md bg-slate-900 text-white">Nộp bài</button>
            )}
          </div>
        </div>

        {submitted && result && (
          <div className={`mb-4 p-4 rounded-lg border ${result.pass ? 'bg-green-50 border-green-500' : 'bg-rose-50 border-rose-500'}`}>
            <div className="font-heading">Kết quả: {result.pass ? 'ĐẠT' : 'KHÔNG ĐẠT'}</div>
            <div>Điểm: {result.score}/30</div>
            {result.wrongLiability && <div className="text-rose-600">Sai câu điểm liệt.</div>}
            <div className="mt-2 flex gap-2">
              <button onClick={()=>nav(0)} className="px-3 py-1.5 rounded-md border bg-white flex items-center gap-2"><RotateCcw className="w-4 h-4"/> Làm lại đề</button>
              <Link to="/lythuyet/hang-b/de/random" className="px-3 py-1.5 rounded-md bg-slate-900 text-white">Đề ngẫu nhiên khác</Link>
            </div>
          </div>
        )}

        {loading ? (
          <div>Đang tải đề thi…</div>
        ) : error ? (
          <div className="text-rose-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left list */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-2xl border border-slate-200 shadow overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 font-heading text-slate-900">Số câu</div>
                <div className="max-h-[70vh] overflow-y-auto p-3 scrollbar-white">
                  <div className="grid grid-cols-9 gap-2">
                    {exam.questions.map((item, idx) => {
                      const sel = answers[item.id];
                      const isActive = current === idx + 1;
                      let cls = 'bg-white text-slate-700 border-slate-300';
                      if (submitted) {
                        if (sel === item.correctIndex) cls = 'bg-green-500 text-white';
                        else if (sel !== undefined) cls = 'bg-rose-500 text-white';
                      } else if (sel !== undefined) {
                        cls = 'bg-slate-300 text-slate-900';
                      }
                      return (
                        <button key={item.id} onClick={()=>setCurrent(idx+1)} className={`h-9 rounded-md border text-xs font-medium hover:shadow transition ${cls} ${isActive ? 'ring-2 ring-slate-900' : ''}`}>
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right question */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="bg-white rounded-2xl border border-slate-200 shadow">
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                  <div className="font-heading text-slate-950 text-lg">Câu hỏi {current}</div>
                  <div className="flex items-center gap-2">
                    <button disabled={current===1} onClick={()=>setCurrent(c=>Math.max(1,c-1))} className="px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> Câu trước</button>
                    <button disabled={current===total||total===0} onClick={()=>setCurrent(c=>Math.min(total,c+1))} className="px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">Câu sau <ChevronRight className="w-4 h-4"/></button>
                  </div>
                </div>

                {q && (
                  <div className="p-5 space-y-4">
                    <div className="font-display text-lg text-slate-900">{q.text}</div>
                    {q.image_url && (
                      <div className="w-full rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <img src={q.image_url} alt="minh họa" className="max-h-[340px] w-full object-contain bg-white" />
                      </div>
                    )}

                    <div className="space-y-2">
                      {q.options.map((opt, idx) => {
                        const sel = answers[q.id];
                        const isSelected = sel === idx;
                        const isCorrect = q.correctIndex === idx;
                        let stateClass = 'bg-white hover:bg-slate-50 border-slate-200';
                        if (submitted) {
                          if (isCorrect) stateClass = 'bg-green-50 border-green-500';
                          if (isSelected && !isCorrect) stateClass = 'bg-rose-50 border-rose-500';
                        } else if (isSelected) {
                          stateClass = 'bg-slate-200 border-slate-300';
                        }
                        return (
                          <button key={idx} onClick={()=>handleChoose(idx)} className={`w-full text-left px-4 py-3 rounded-md border transition flex items-center gap-3 ${stateClass}`}>
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-900 text-white text-xs">{idx + 1}</span>
                            <span className="font-body text-slate-800">{opt}</span>
                            {submitted && isCorrect && <CheckCircle2 className="ml-auto w-5 h-5 text-green-600"/>}
                            {submitted && isSelected && !isCorrect && <XCircle className="ml-auto w-5 h-5 text-rose-600"/>}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && (
                      <div className="mt-3 rounded-md border border-slate-200 bg-white p-4">
                        <div className="font-heading text-slate-900 mb-1">Giải thích</div>
                        <div className="text-slate-700 whitespace-pre-line">{q.explanation || 'Chưa có giải thích cho câu hỏi này.'}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

