import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../utils/api';
import { LockClosedIcon, UserIcon, GlobeAltIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const domainMapping = {
  'parekhchamber.com': 'ParekhChamberofTextile01',
  'parekhtrade.com': 'ParekheTradeMarket02',
  'parekhpolyfabrics.com': 'ParekhSouthernPolyfabrics03',
  'parekhlinen.com': 'ParekhLinen04',
  'parekhrayon.com': 'ParekhRayon05',
  'parekhfabrics.com': 'ParekhFabrics06',
  'parekhsilk.com': 'ParekhSilk07',
  'localhost': 'ParekheTradeMarket02', // For development
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [testSiteId, setTestSiteId] = useState('ParekhChamberofTextile01');
  const [isLocal, setIsLocal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const hostname = window.location.hostname;
    const isDev = hostname === 'localhost';
    setIsLocal(isDev);

    const cleanHostname = hostname.replace('www.', '');
    const siteId = isDev ? testSiteId : (domainMapping[cleanHostname] || domainMapping['localhost']);
    
    const siteNames = {
      'ParekhChamberofTextile01': 'Parekh Chamber of Textile',
      'ParekheTradeMarket02': 'Parekh e-Trade Market',
      'ParekhSouthernPolyfabrics03': 'Parekh Southern Polyfabrics',
      'ParekhLinen04': 'Parekh Linen',
      'ParekhRayon05': 'Parekh Rayon',
      'ParekhFabrics06': 'Parekh Fabrics',
      'ParekhSilk07': 'Parekh Silk',
    };
    
    setSiteName(siteNames[siteId] || 'Admin Dashboard');
  }, [testSiteId]);

  const getLogo = () => {
    const hostname = window.location.hostname;
    const isDev = hostname === 'localhost';
    const cleanHostname = hostname.replace('www.', '');
    const siteId = isDev ? testSiteId : (domainMapping[cleanHostname] || domainMapping['localhost']);
    
    // Extract the sequence number from the end of siteId (e.g., '01', '02')
    const sequence = siteId.slice(-2);
    // Convert '01' to '1', '02' to '2', etc.
    const num = parseInt(sequence);
    
    if (num >= 1 && num <= 7) {
      return `/adminparekh/images/${num}.png`;
    }
    return "/adminparekh/logo.png"; // Fallback
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const hostname = window.location.hostname;
      const isDev = hostname === 'localhost';
      const cleanHostname = hostname.replace('www.', '');
      const siteId = isDev ? testSiteId : (domainMapping[cleanHostname] || domainMapping['localhost']);

      const res = await authApi.login({ username, password, siteId });

      if (res.data.success) {
        localStorage.setItem('hc_admin_token', res.data.data.token);
        localStorage.setItem('hc_admin_user', JSON.stringify(res.data.data));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12">
      <div className="max-w-md w-full space-y-8 p-6 sm:p-10 bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 animate-scale-in">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 mb-6">
            <img src={getLogo()} alt="Logo" className="h-16 w-16 object-contain" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <div className="mt-2 flex items-center justify-center gap-2 text-slate-500 font-bold tracking-widest text-[10px]">
             <GlobeAltIcon className="h-3 w-3" />
             <span className="uppercase">
               {siteName.includes('e-') ? (
                 <>
                   {siteName.split('e-')[0].toUpperCase()}
                   <span className="lowercase">e</span>
                   {siteName.split('e-')[1].toUpperCase()}
                 </>
               ) : siteName.toUpperCase()} ADMIN PANEL
             </span>
          </div>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl animate-shake">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="clean-input clean-input-icon font-bold text-slate-900"
                  placeholder="admin_username"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="clean-input clean-input-icon font-bold text-slate-900 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {isLocal && (
            <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100 space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-widest text-amber-600 ml-2">Testing Mode: Select Site</label>
              <select 
                value={testSiteId} 
                onChange={(e) => setTestSiteId(e.target.value)}
                className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ParekhChamberofTextile01">Chamber of Textile</option>
                <option value="ParekheTradeMarket02">e-Trade Market</option>
                <option value="ParekhSouthernPolyfabrics03">Southern Polyfabrics</option>
                <option value="ParekhLinen04">Linen</option>
                <option value="ParekhRayon05">Rayon</option>
                <option value="ParekhFabrics06">Fabrics</option>
                <option value="ParekhSilk07">Silk</option>
              </select>
              <p className="text-[9px] font-bold text-amber-500 italic px-1 leading-relaxed">
                Note: This selector only appears on localhost to help you test multiple sites easily.
              </p>
            </div>
          )}


          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full premium-btn-primary py-4 sm:py-5 text-base sm:text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authorize Access</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Secured by Parekh Global Infrastructure
        </p>
      </div>
    </div>
  );
};

export default Login;
