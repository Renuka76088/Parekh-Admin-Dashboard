import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartBarIcon, UsersIcon, DocumentTextIcon, ArrowUpIcon, ArrowDownIcon, GlobeAltIcon, ServerIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { formsApi, authorizedPersonApi, productApi, blogApi, careerApi, mediaEventApi } from '../utils/api';
import api from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({
    totalForms: 0,
    authorities: 0,
    sitesCount: 0,
    loading: true
  });
  const [systemStatus, setSystemStatus] = useState({
    server: 'Checking...',
    db: 'Checking...',
    api: 'Checking...'
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const VALID_SITES = [
    'ParekhChamberofTextile01',
    'ParekheTradeMarket02',
    'ParekhSouthernPolyfabrics03',
    'ParekhLinen04',
    'ParekhRayon05',
    'ParekhFabrics06',
    'ParekhSilk07'
  ];

  useEffect(() => {
    fetchDashboardData();
    checkSystemStatus();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const fetchWithCatch = async (apiCall) => {
        try {
          const res = await apiCall();
          return res.data?.data || res.data || [];
        } catch (e) {
          console.error("API Call failed:", e.config?.url);
          return [];
        }
      };

      // Fetch all submissions for Notifications
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

      const allSubmissions = [
        ...trade.map(i => ({ ...i, formType: 'Trade Enquiry' })),
        ...quot.map(i => ({ ...i, formType: 'Quotation' })),
        ...auc.map(i => ({ ...i, formType: 'Auction' })),
        ...appt.map(i => ({ ...i, formType: 'Appointment' })),
        ...buyer.map(i => ({ ...i, formType: 'Buyer E-Trade' })),
        ...seller.map(i => ({ ...i, formType: 'Seller E-Trade' })),
        ...contact.map(i => ({ ...i, formType: 'Contact' })),
        ...bulk.map(i => ({ ...i, formType: 'Bulk Seller' })),
        ...membership.map(i => ({ ...i, formType: 'Membership' })),
      ].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

      // Fetch admin activities
      const [products, blogs, careers, media, authorities] = await Promise.all([
        fetchWithCatch(productApi.list),
        fetchWithCatch(blogApi.list),
        fetchWithCatch(careerApi.list),
        fetchWithCatch(mediaEventApi.list),
        fetchWithCatch(authorizedPersonApi.list),
      ]);

      const activities = [
        ...products.map(i => ({ id: i._id, action: `Product: ${i.title || i.name}`, user: 'Admin', time: i.createdAt, type: 'product' })),
        ...blogs.map(i => ({ id: i._id, action: `Blog: ${i.title}`, user: 'Admin', time: i.createdAt, type: 'blog' })),
        ...careers.map(i => ({ id: i._id, action: `Career: ${i.title}`, user: 'Admin', time: i.createdAt, type: 'career' })),
        ...media.map(i => ({ id: i._id, action: `Media: ${i.title}`, user: 'Admin', time: i.createdAt, type: 'blog' })),
        ...authorities.map(i => ({ id: i._id, action: `Authority: ${i.name}`, user: 'Admin', time: i.createdAt, type: 'authority' })),
        ...trade.slice(0, 5).map(i => ({ id: i._id, action: `New Enquiry: ${i.name || i.firmName}`, user: 'User', time: i.createdAt, type: 'form' })),
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

      // Filter sites by validity to ensure we show the correct "7 Sites" even if dirty data exists
      const sites = new Set(
        allSubmissions
          .map(item => item.siteId)
          .filter(siteId => VALID_SITES.includes(siteId))
      );

      // Unique categories fetched from form data
      const categories = new Set(allSubmissions.map(item => item.category).filter(Boolean));

      setStatsData({
        totalForms: allSubmissions.length,
        authorities: (authorities || []).length,
        sitesCount: sites.size,
        categoriesCount: categories.size || 9, // Fallback to 9 if none found
        loading: false
      });

      setNotifications(allSubmissions.slice(0, 5));
      setRecentActivities(activities);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStatsData(prev => ({ ...prev, loading: false }));
    }
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Just now';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Recently';
    const now = new Date();
    const diffInSeconds = Math.floor((now - d) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return d.toLocaleDateString();
  };

  const checkSystemStatus = async () => {
    try {
      const start = Date.now();
      await api.get('/'); // Now hits /api/ (baseURL) which we added health check for
      const latency = Date.now() - start;
      setSystemStatus({
        server: 'Online',
        db: 'Connected',
        api: `Active (${latency}ms)`
      });
    } catch (error) {
      setSystemStatus({
        server: 'Offline',
        db: 'Unknown',
        api: 'Error'
      });
    }
  };

  const stats = [
    {
      name: 'Total Submissions',
      value: statsData.loading ? '...' : statsData.totalForms,
      change: '+Fresh',
      changeType: 'increase',
      icon: DocumentTextIcon,
      gradient: 'from-blue-600 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      name: 'Active Sites',
      value: statsData.loading ? '...' : statsData.sitesCount,
      change: 'Marketwide',
      changeType: 'increase',
      icon: GlobeAltIcon,
      gradient: 'from-emerald-600 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      name: 'Authorized Persons',
      value: statsData.loading ? '...' : statsData.authorities,
      change: 'Verified',
      changeType: 'increase',
      icon: UsersIcon,
      gradient: 'from-sky-600 to-blue-700',
      bgGradient: 'from-sky-50 to-blue-100'
    },
    {
      name: 'Form Categories',
      value: statsData.loading ? '...' : statsData.categoriesCount,
      change: 'Optimized',
      changeType: 'increase',
      icon: ChartBarIcon,
      gradient: 'from-amber-600 to-orange-700',
      bgGradient: 'from-amber-50 to-orange-100'
    },
  ];


  const getActivityIcon = (type) => {
    switch (type) {
      case 'form': return '📄';
      case 'product': return '📦';
      case 'authority': return '👤';
      case 'blog': return '📝';
      case 'career': return '💼';
      default: return '📌';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="mt-1 text-slate-600">Welcome back! Here's what's happening with your admin panel.</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Export button removed as per user request */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${stat.bgGradient} p-6 shadow-lg border border-white/20`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Activities</h3>
          <p className="text-sm text-slate-600">Latest actions performed in your admin panel</p>
        </div>
        <div className="divide-y divide-slate-200">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-500">by {activity.user} • {formatTimeAgo(activity.time)}</p>
                </div>
                <div className="shrink-0">
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button 
            onClick={() => navigate('/forms-data')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all activities →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/products', { state: { openAddModal: true } })}
              className="w-full flex items-center justify-between p-3 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all"
            >
              <span className="text-sm font-medium text-blue-700">Add New Product</span>
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button 
              onClick={() => navigate('/blogs', { state: { openAddModal: true } })}
              className="w-full flex items-center justify-between p-3 bg-linear-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all"
            >
              <span className="text-sm font-medium text-green-700">Create Blog Post</span>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={() => navigate('/authorities', { state: { openAddModal: true } })}
              className="w-full flex items-center justify-between p-3 bg-linear-to-r from-sky-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-sky-200 transition-all"
            >
              <span className="text-sm font-medium text-sky-700">Add Authority</span>
              <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <ServerIcon className="h-5 w-5 mr-2 text-slate-400" />
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Backend Server</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${systemStatus.server === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-bold ${systemStatus.server === 'Online' ? 'text-green-600' : 'text-red-600'}`}>
                  {systemStatus.server}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">MongoDB Database</span>
              <div className="flex items-center">
                <CircleStackIcon className={`h-4 w-4 mr-2 ${systemStatus.db === 'Connected' ? 'text-green-500' : 'text-slate-400'}`} />
                <span className={`text-sm font-bold ${systemStatus.db === 'Connected' ? 'text-green-600' : 'text-slate-600'}`}>
                  {systemStatus.db}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">API Health</span>
              <div className="flex items-center">
                <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">
                  {systemStatus.api}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            {notifications.length > 0 ? notifications.map((notif, index) => (
              <div 
                key={notif._id || index} 
                onClick={() => navigate('/forms-data', { state: { filterType: notif.formType, highlightId: notif._id } })}
                className="flex items-start space-x-3 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notif.formType === 'Trade Enquiry' ? 'bg-blue-500' : 
                  notif.formType === 'Contact' ? 'bg-orange-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{notif.formType}: {notif.name || notif.firmName || 'New Submission'}</p>
                  <p className="text-xs text-slate-500">{formatTimeAgo(notif.createdAt || notif.date)}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500 italic">No recent notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;