import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const API_ROOT_URL = ((import.meta.env.VITE_BACKEND_URL) || 'http://localhost:8000') + '/api';
const API_BASE_URL = API_ROOT_URL + '/v1';

export default function CoursesPage(){
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ full_name:'', phone:'', email:'', address:'', course_id:'', desired_schedule:'', notes:'' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try{
      const res = await fetch(`${API_BASE_URL}/courses?per_page=100`);
      const data = await res.json();
      const list = data?.data || data?.courses || [];
      setCourses(list);
    }catch(e){
      console.error('fetchCourses', e);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchCourses(); },[]);

  const submitRegistration = async (e) => {
    e.preventDefault();
    setSubmitting(true); setSuccess(''); setError('');
    try{
      const payload = { ...form, course_id: form.course_id? Number(form.course_id) : null };
      const res = await fetch(`${API_BASE_URL}/registrations`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      const data = await res.json();
      if(!res.ok || !data.success){ throw new Error(data.message || 'Đăng ký thất bại'); }
      setSuccess('Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.');
      setForm({ full_name:'', phone:'', email:'', address:'', course_id:'', desired_schedule:'', notes:'' });
    }catch(err){
      setError(err.message || 'Có lỗi xảy ra');
    }finally{
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 bg-white text-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold mb-2">Khóa học lái xe</h1>
          {loading ? (
            <div className="text-gray-600">Đang tải...</div>
          ) : courses.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map(c => (
                <div key={c.id} className="rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{c.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{c.is_active? 'Mở' : 'Tạm dừng'}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{c.license_name || 'Hạng: N/A'} • {c.duration || 'Thời lượng linh hoạt'}</div>
                  {c.description && <p className="text-sm mt-2 line-clamp-3">{c.description}</p>}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="text-xl font-bold text-blue-700">{Number(c.price||0).toLocaleString('vi-VN')} ₫</div>
                    {c.discount_price>0 && (
                      <div className="text-sm text-red-600 font-semibold">KM: {Number(c.discount_price).toLocaleString('vi-VN')} ₫</div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button onClick={()=> setForm(f=>({...f, course_id: c.id}))} variant="outline" size="sm">Chọn khóa này</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600">Chưa có khóa học.</div>
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Đăng ký khóa học</h2>
            {success && <div className="mb-2 text-green-700 bg-green-50 border border-green-200 rounded p-2 text-sm">{success}</div>}
            {error && <div className="mb-2 text-red-700 bg-red-50 border border-red-200 rounded p-2 text-sm">{error}</div>}
            <form onSubmit={submitRegistration} className="space-y-3">
              <Input placeholder="Họ và tên" value={form.full_name} onChange={(e)=>setForm({...form, full_name:e.target.value})} required />
              <Input placeholder="Điện thoại" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} required />
              <Input type="email" placeholder="Email (không bắt buộc)" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
              <Input placeholder="Địa chỉ" value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} />
              <select className="w-full border rounded-md p-2" value={form.course_id} onChange={(e)=>setForm({...form, course_id:e.target.value})}>
                <option value="">Chọn khóa học</option>
                {courses.map(c=> (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
              <Input placeholder="Lịch mong muốn" value={form.desired_schedule} onChange={(e)=>setForm({...form, desired_schedule:e.target.value})} />
              <Textarea rows={4} placeholder="Ghi chú thêm" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
              <Button type="submit" disabled={submitting} className="w-full">{submitting? 'Đang gửi...' : 'Đăng ký'}</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

