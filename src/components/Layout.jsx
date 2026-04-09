import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HomeIcon, DocumentTextIcon, UserGroupIcon, CubeIcon, TagIcon, BriefcaseIcon, DocumentIcon, PencilSquareIcon, PhotoIcon, Bars3Icon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Close sidebar on mobile when route changes
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 lg:flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform bg-white shadow-2xl transition-all duration-300 ease-in-out lg:translate-x-0 lg:h-screen lg:flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${sidebarOpen ? 'w-72 xl:w-80' : sidebarCollapsed ? 'w-20' : 'w-72 xl:w-80'}`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6 border-b border-slate-200 bg-linear-to-r from-blue-600 to-purple-600">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className={`${sidebarCollapsed ? 'hidden' : 'inline-flex'} ml-1 text-xl font-bold text-white`}>Admin Panel</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <ArrowRightIcon className="h-5 w-5" /> : <ArrowLeftIcon className="h-5 w-5" />}
              </button>
              <button
                className="lg:hidden text-white hover:text-slate-200 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation - Scrollable area */}
          <div className="flex-1 overflow-y-auto">
            <nav className={`px-3 py-6 space-y-2 ${sidebarCollapsed ? 'space-y-3' : ''}`}>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    title={sidebarCollapsed ? item.name : undefined}
                    className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    <span className={`${sidebarCollapsed ? 'hidden' : 'ml-3'}`}>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer - Always visible */}
          <div className="shrink-0 p-4 border-t border-slate-200">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="h-8 w-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">AD</span>
              </div>
              <div className={`${sidebarCollapsed ? 'hidden' : 'ml-3'}`}>
                <p className="text-sm font-medium text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">admin@company.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 min-w-0 ${sidebarCollapsed ? 'lg:ml-20 xl:ml-24' : 'lg:ml-72 xl:ml-80'} h-screen overflow-y-auto`}>
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-700 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-slate-900">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification bell */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 7v5h5l-5 5v-5z" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile dropdown */}
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;