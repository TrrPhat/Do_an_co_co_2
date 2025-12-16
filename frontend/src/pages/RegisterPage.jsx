import { useState, useEffect } from 'react';
import { apiFetch, setToken, getToken } from '@/lib/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (getToken()) navigate('/');
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      setToken(res.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <div className="container max-w-4xl bg-white rounded-lg pt-6">
        <div className="flex justify-center w-full h-full my-auto">
          <div className="flex items-center justify-center w-full p-4 lg:p-12">
            <div className="flex items-center xl:p-10 w-full max-w-md">
              <form className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl" onSubmit={onSubmit}>
                <h3 className="mb-3 text-4xl font-extrabold text-gray-900">Create Account</h3>
                <p className="mb-4 text-gray-700">Enter your details to register</p>

                {error && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
                )}

                <label htmlFor="name" className="mb-2 text-sm text-start text-gray-900">Full name*</label>
                <input id="name" type="text" placeholder="Your name" value={name} onChange={(e)=>setName(e.target.value)} className="flex items-center w-full px-5 py-4 mb-5 text-sm font-medium outline-none focus:bg-gray-100 placeholder:text-gray-500 bg-gray-200 text-gray-900 rounded-2xl"/>

                <label htmlFor="email" className="mb-2 text-sm text-start text-gray-900">Email*</label>
                <input id="email" type="email" placeholder="you@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="flex items-center w-full px-5 py-4 mb-5 text-sm font-medium outline-none focus:bg-gray-100 placeholder:text-gray-500 bg-gray-200 text-gray-900 rounded-2xl"/>

                <label htmlFor="password" className="mb-2 text-sm text-start text-gray-900">Password*</label>
                <input id="password" type="password" placeholder="Enter a password" value={password} onChange={(e)=>setPassword(e.target.value)} className="flex items-center w-full px-5 py-4 mb-7 text-sm font-medium outline-none focus:bg-gray-100 placeholder:text-gray-500 bg-gray-200 text-gray-900 rounded-2xl"/>

                <button disabled={loading} className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 bg-indigo-600 disabled:opacity-60">
                  {loading ? 'Creating...' : 'Create Account'}
                </button>

                <p className="text-sm leading-relaxed text-gray-900">Already have an account? <Link to="/login" className="font-bold text-gray-700">Sign In</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

