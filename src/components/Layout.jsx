import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  HomeIcon, DocumentTextIcon, UserGroupIcon, CubeIcon, 
  TagIcon, BriefcaseIcon, DocumentIcon, PencilSquareIcon, 
  PhotoIcon, Bars3Icon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon,
  BellIcon, UserCircleIcon
} from '@heroicons/react/24/outline';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

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
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200">
                <span className="text-white font-black text-xl">P</span>
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
                <p className="text-sm font-bold text-slate-900 truncate">Siddharth Parekh</p>
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
            
            <div className="flex items-center gap-3">
                <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl relative">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl">
                    <UserCircleIcon className="h-6 w-6" />
                </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] px-6 py-8 lg:px-10">
          <div className="max-w-7xl mx-auto animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;