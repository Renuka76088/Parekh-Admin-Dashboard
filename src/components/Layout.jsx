import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  HomeIcon, DocumentTextIcon, UserGroupIcon, CubeIcon, 
  TagIcon, BriefcaseIcon, DocumentIcon, PencilSquareIcon, 
  PhotoIcon, Bars3Icon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon,
    BellIcon, UserCircleIcon, ClockIcon
} from '@heroicons/react/24/outline';
import { formsApi } from '../utils/api';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const location = useLocation();

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

      const all = [
        ...trade.map(i => ({ ...i, type: 'Trade Enquiry' })),
        ...quot.map(i => ({ ...i, type: 'Quotation' })),
        ...auc.map(i => ({ ...i, type: 'Auction' })),
        ...appt.map(i => ({ ...i, type: 'Appointment' })),
        ...buyer.map(i => ({ ...i, type: 'Buyer E-Trade' })),
        ...seller.map(i => ({ ...i, type: 'Seller E-Trade' })),
        ...contact.map(i => ({ ...i, type: 'Contact' })),
        ...bulk.map(i => ({ ...i, type: 'Bulk Seller' })),
        ...membership.map(i => ({ ...i, type: 'Membership' })),
      ].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

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
    { name: 'Careers', href: '/careers', icon: BriefcaseIcon },
    { name: 'Circulars', href: '/circulars', icon: DocumentIcon },
    { name: 'Blogs', href: '/blogs', icon: PencilSquareIcon },
    { name: 'Media Events', href: '/media-events', icon: PhotoIcon },
  ];

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
        className={`fixed inset-y-0 left-0 z-50 transform border-r border-slate-200 bg-white transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72 xl:w-80'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl overflow-hidden shadow-sm bg-white">
                <img src="/adminparekh/logo.png" alt="Logo" className="h-full w-full object-contain p-0.5" />
              </div>
              <span className={`font-black text-xl text-slate-900 tracking-tight transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                Parekh <span className="text-indigo-600 text-sm font-bold uppercase ml-1">Admin</span>
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
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`h-6 w-6 shrink-0 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
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

          {/* User Profile */}
          <div className="p-4 border-t border-slate-100">
            <div className={`p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center overflow-hidden ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="h-10 w-10 shrink-0 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-indigo-100 text-indigo-700 font-black">
                A
              </div>
              <div className={`ml-3 transition-opacity duration-300 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Super Admin</p>
              </div>
            </div>
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
                                <p className="text-xs text-slate-500 truncate">{notif.name || notif.firmName || 'Anonymous Sender'}</p>
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
                        Vew all communications
                      </Link>
                    </div>
                  </>
                )}
                <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl">
                    <UserCircleIcon className="h-6 w-6" />
                </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] px-6 py-8 lg:px-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;