import { useState, useEffect } from 'react';
import { apiFetch, setToken, getToken } from '@/lib/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keep, setKeep] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = getToken();
    if (t) navigate('/');
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(res.token, keep);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
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
                <h3 className="mb-3 text-4xl font-extrabold text-gray-900">Sign In</h3>
                <p className="mb-4 text-gray-700">Enter your email and password</p>

                {error && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
                )}

                <label htmlFor="email" className="mb-2 text-sm text-start text-gray-900">Email*</label>
                <input id="email" type="email" placeholder="you@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-100 mb-7 placeholder:text-gray-500 bg-gray-200 text-gray-900 rounded-2xl"/>

                <label htmlFor="password" className="mb-2 text-sm text-start text-gray-900">Password*</label>
                <input id="password" type="password" placeholder="Enter a password" value={password} onChange={(e)=>setPassword(e.target.value)} className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-gray-100 placeholder:text-gray-500 bg-gray-200 text-gray-900 rounded-2xl"/>

                <div className="flex flex-row justify-between mb-8">
                  <label className="relative inline-flex items-center mr-3 cursor-pointer select-none">
                    <input type="checkbox" checked={keep} onChange={(e)=>setKeep(e.target.checked)} className="sr-only peer" />
                    <div className="w-5 h-5 bg-white border-2 rounded-sm border-gray-400 peer-checked:border-0 peer-checked:bg-indigo-600" />
                    <span className="ml-3 text-sm font-normal text-gray-900">Keep me logged in</span>
                  </label>
                  <span className="mr-4 text-sm font-medium text-indigo-600">Forgot password?</span>
                </div>

                <button disabled={loading} className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 bg-indigo-600 disabled:opacity-60">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-sm leading-relaxed text-gray-900">Not registered yet? <Link to="/signup" className="font-bold text-gray-700">Create an Account</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

