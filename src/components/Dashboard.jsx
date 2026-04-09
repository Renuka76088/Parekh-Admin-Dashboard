import { ChartBarIcon, UsersIcon, CubeIcon, DocumentTextIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Forms',
      value: '150',
      change: '+12%',
      changeType: 'increase',
      icon: DocumentTextIcon,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      name: 'Products',
      value: '45',
      change: '+8%',
      changeType: 'increase',
      icon: CubeIcon,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      name: 'Authorities',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: UsersIcon,
      gradient: 'from-sky-500 to-blue-600',
      bgGradient: 'from-sky-50 to-blue-100'
    },
    {
      name: 'Blogs',
      value: '8',
      change: '-1',
      changeType: 'decrease',
      icon: ChartBarIcon,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100'
    },
  ];

  const recentActivities = [
    { id: 1, action: 'New tender form submitted', user: 'John Doe', time: '2 hours ago', type: 'form' },
    { id: 2, action: 'Product category updated', user: 'Admin', time: '4 hours ago', type: 'product' },
    { id: 3, action: 'New authority added', user: 'Admin', time: '6 hours ago', type: 'authority' },
    { id: 4, action: 'Blog post published', user: 'Jane Smith', time: '1 day ago', type: 'blog' },
    { id: 5, action: 'Career opening updated', user: 'Admin', time: '2 days ago', type: 'career' },
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="mt-1 text-slate-600">Welcome back! Here's what's happening with your admin panel.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </button>
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
                  <p className="text-sm text-slate-500">by {activity.user} • {activity.time}</p>
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
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            View all activities →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all">
              <span className="text-sm font-medium text-blue-700">Add New Product</span>
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-linear-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all">
              <span className="text-sm font-medium text-green-700">Create Blog Post</span>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-linear-to-r from-sky-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-sky-200 transition-all">
              <span className="text-sm font-medium text-sky-700">Add Authority</span>
              <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Server Status</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Database</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Email Service</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">New form submission</p>
                <p className="text-xs text-slate-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">System maintenance</p>
                <p className="text-xs text-slate-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Backup completed</p>
                <p className="text-xs text-slate-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;