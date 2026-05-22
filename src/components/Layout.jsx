import { Link, Outlet, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import {
  HomeIcon, DocumentTextIcon, UserGroupIcon, CubeIcon,
  TagIcon, BriefcaseIcon, DocumentIcon, PencilSquareIcon,
  PhotoIcon, Bars3Icon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon,
  BellIcon, UserCircleIcon, ClockIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon,
  EyeIcon, EyeSlashIcon, DocumentDuplicateIcon, BanknotesIcon, SparklesIcon
} from '@heroicons/react/24/outline';

import { formsApi, authApi } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('hc_admin_user') || '{}'));
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: user.username, password: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('hc_admin_token');
    localStorage.removeItem('hc_admin_user');
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const res = await authApi.updateProfile(profileForm);
      if (res.data.success) {
        alert("Profile updated successfully!");
        setUser({ ...user, username: profileForm.username });
        localStorage.setItem('hc_admin_user', JSON.stringify({ ...user, username: profileForm.username }));
        setShowSettingsModal(false);
        setProfileForm({ ...profileForm, password: '' });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const siteNames = {
    'ParekhChamberofTextile01': 'Parekh Chamber of Textile',
    'ParekheTradeMarket02': 'Parekh e-Trade Market',
    'ParekhSouthernPolyfabrics03': 'Parekh Southern Polyfabrics',
    'ParekhLinen04': 'Parekh Linen',
    'ParekhRayon05': 'Parekh Rayon',
    'ParekhFabrics06': 'Parekh Fabrics',
    'ParekhSilk07': 'Parekh Silk',
  };

  const currentSiteName = siteNames[user.siteId] || 'Admin';

  const getLogo = () => {
    const siteId = user.siteId || '';
    const sequence = siteId.slice(-2);
    const num = parseInt(sequence);
    if (num >= 1 && num <= 7) {
      return `/adminparekh/images/${num}.png`;
    }
    return "/adminparekh/logo.png";
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotifs(true);
      const fetchWithCatch = async (apiCall) => {
        try {
          const res = await apiCall();
          return res.data?.data || res.data || [];
        } catch (e) { return []; }
      };

      const [trade, quot, auc, appt, buyer, seller, contact, bulk, membership] = await Promise.all([
        fetchWithCatch(formsApi.getTradeEnquiries),
        fetchWithCatch(formsApi.getQuotations),
        fetchWithCatch(formsApi.getAuctions),
        fetchWithCatch(formsApi.getAppointments),
        fetchWithCatch(formsApi.getBuyerSubmissions),
        fetchWithCatch(formsApi.getSellerSubmissions),
        fetchWithCatch(formsApi.getContactSubmissions),
        fetchWithCatch(formsApi.getBulkSellers),
        fetchWithCatch(formsApi.getMembershipEnquiries),
      ]);

      let all = [
        ...trade.map(i => ({ ...i, type: 'Trade Enquiry' })),
        ...quot.map(i => ({ ...i, type: 'e-Quotation' })),
        ...auc.map(i => ({ ...i, type: 'e-Auction' })),
        ...appt.map(i => ({ ...i, type: 'Appointment' })),
        ...buyer.map(i => ({ ...i, type: 'Buyer e-Trade' })),
        ...seller.map(i => ({ ...i, type: 'Seller e-Trade' })),
        ...contact.map(i => ({ ...i, type: 'Contact' })),
        ...bulk.map(i => ({ ...i, type: 'Bulk Seller' })),
        ...membership.map(i => ({ ...i, type: 'Membership' })),
      ].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

      // Filter by siteId
      if (user.siteId && user.siteId !== 'all') {
        all = all.filter(item => item.siteId === user.siteId);
      }

      setNotifications(all.slice(0, 10));
    } catch (error) {
      console.error("Notif Error:", error);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    setSidebarOpen(false);
    setShowNotifDropdown(false);
  }, [location]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Forms Data', href: '/forms-data', icon: DocumentTextIcon },
    { name: 'Authorities', href: '/authorities', icon: UserGroupIcon },
    { name: 'Products & Services', href: '/products', icon: CubeIcon },
    { name: 'Categories', href: '/categories', icon: TagIcon },
    { name: 'Management', href: '/management', icon: UserGroupIcon },
    { name: 'e-Quotation', href: '/e-quotation', icon: DocumentTextIcon },
    { name: 'e-Auction', href: '/e-auction', icon: BanknotesIcon },
    { name: 'Tenders & Contracts', href: '/tenders', icon: DocumentDuplicateIcon },
    { name: 'Careers', href: '/careers', icon: BriefcaseIcon },
    { name: 'Circulars', href: '/circulars', icon: DocumentIcon },
    { name: 'Blogs', href: '/blogs', icon: PencilSquareIcon },
    { name: 'Notice Board', href: '/notice-board', icon: BellIcon },
    { name: 'Media Events', href: '/media-events', icon: PhotoIcon },
    { name: 'Chamber Services', href: '/chamber-services', icon: SparklesIcon },
  ];




  const filteredNavigation = navigation.filter(item => {
    // Restrict Authorities module to specific sites only
    if (item.name === 'Authorities') {
      return (
        user.siteId === 'all' ||
        user.siteId === 'ParekhChamberofTextile01' ||
        user.siteId === 'ParekheTradeMarket02'
      );
    }

    if (user.siteId === 'ParekhChamberofTextile01') {
      if (item.name === 'Products & Services' || item.name === 'Categories') return false;
    }

    // Chamber Services only for Chamber site or super admin
    if (item.name === 'Chamber Services') {
      return (
        user.siteId === 'all' ||
        user.siteId === 'ParekhChamberofTextile01'
      );
    }

    // Notice Board only for Chamber site or super admin
    if (item.name === 'Notice Board') {
      return (
        user.siteId === 'all' ||
        user.siteId === 'ParekhChamberofTextile01'
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform border-r border-slate-200 bg-white transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72 xl:w-80'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl overflow-hidden shadow-sm bg-white">
                <img src={getLogo()} alt="Logo" className="h-full w-full object-contain p-0.5" />
              </div>
              <span className={`font-black text-xl text-slate-900 tracking-tight transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                {currentSiteName.split(' ')[0]} <span className="text-indigo-600 text-sm font-bold uppercase ml-1">Admin</span>
              </span>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 group relative ${isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <item.icon className={`h-6 w-6 shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                  <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    {item.name}
                  </span>
                  {isActive && !sidebarCollapsed && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                  )}
                  {sidebarCollapsed && (
                    <div className="absolute left-14 scale-0 group-hover:scale-100 transition-transform origin-left bg-slate-900 text-white text-xs px-3 py-2 rounded-lg font-bold z-50 shadow-xl ml-2">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className={`w-full p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors flex items-center overflow-hidden ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0" />
              <div className={`ml-3 transition-opacity duration-300 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                <p className="text-[11px] font-black uppercase tracking-wider">Logout System</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header / Navbar */}
        <header className="h-20 shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Server: Online</span>
            </div>

            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`p-2.5 rounded-xl relative transition-all ${showNotifDropdown ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <BellIcon className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotifDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifDropdown(false)}></div>
                  <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50 animate-scale-in origin-top-right">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Activity</h3>
                      <span className="text-[10px] font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full">LIVE</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {loadingNotifs && notifications.length === 0 ? (
                        <div className="p-10 text-center">
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent"></div>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 italic text-sm">No new notifications</div>
                      ) : (
                        notifications.map((notif, idx) => (
                          <Link
                            key={notif._id || idx}
                            to="/forms-data"
                            state={{ filterType: notif.type, highlightId: notif._id }}
                            onClick={() => setShowNotifDropdown(false)}
                            className="flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                          >
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <DocumentTextIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">New {notif.type}</p>
                              <p className="text-xs text-slate-500 truncate">{notif.name || notif.firmName || notif.traderName || notif.visitorName || notif.buyerName || notif.sellerName || 'Anonymous Sender'}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1 flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                {new Date(notif.createdAt || notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                    <Link
                      to="/forms-data"
                      className="block w-full py-4 text-center text-[11px] font-black text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all uppercase tracking-widest border-t border-slate-100"
                    >
                      View all communications
                    </Link>
                  </div>
                </>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`p-2.5 rounded-xl transition-all ${showProfileMenu ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <UserCircleIcon className="h-6 w-6" />
                </button>

                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                    <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-scale-in origin-top-right py-2">
                      <div className="px-5 py-3 border-b border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                        <p className="text-sm font-black text-slate-900 truncate">{user.username}</p>
                      </div>
                      <button
                        onClick={() => { setShowSettingsModal(true); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      >
                        <Cog6ToothIcon className="h-4 w-4" />
                        <span className="font-bold">Account Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span className="font-bold">Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Settings Modal */}
        {showSettingsModal && createPortal(
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
            {/* Enhanced Backdrop */}
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={() => setShowSettingsModal(false)} />
            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden flex flex-col animate-scale-in max-h-[90vh]">
              <div className="p-4 sm:p-6 md:px-8 md:py-6 border-b border-slate-50 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Account Settings</h3>
                <button onClick={() => setShowSettingsModal(false)} className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateProfile} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 min-h-0 space-y-6 custom-scrollbar">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2">Username</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    className="clean-input font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2">New Password (leave blank to keep current)</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                      className="clean-input font-bold text-slate-900 pr-12"
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
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full premium-btn-primary py-4 shadow-lg shadow-indigo-100 disabled:opacity-70"
                >
                  {updateLoading ? 'Updating...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] px-6 py-8 lg:px-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
