import { useState } from 'react';
import { EnvelopeIcon, EyeIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

const FormsData = () => {
  const [activeTab, setActiveTab] = useState('tender');

  const tabs = [
    { id: 'tender', label: 'Tender & Contract', count: 24 },
    { id: 'quotation', label: 'E-Quotation', count: 18 },
    { id: 'auction', label: 'E-Auction', count: 12 },
    { id: 'appointment', label: 'Appointment', count: 8 },
    { id: 'membership', label: 'Membership', count: 15 },
    { id: 'buyer', label: 'Buyer', count: 32 },
    { id: 'seller', label: 'Seller', count: 28 },
    { id: 'trade', label: 'Trade Enquiry', count: 20 },
  ];

  const mockData = {
    tender: [
      { id: 1, name: 'John Doe', email: 'john@example.com', date: '2023-10-01', status: 'Pending', phone: '+1 234 567 8900' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', date: '2023-10-02', status: 'Approved', phone: '+1 234 567 8901' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', date: '2023-10-03', status: 'Rejected', phone: '+1 234 567 8902' },
    ],
    quotation: [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', date: '2023-10-03', status: 'Pending', phone: '+1 234 567 8903' },
      { id: 2, name: 'Bob Wilson', email: 'bob@example.com', date: '2023-10-04', status: 'Approved', phone: '+1 234 567 8904' },
    ],
    auction: [
      { id: 1, name: 'Sarah Davis', email: 'sarah@example.com', date: '2023-10-05', status: 'Pending', phone: '+1 234 567 8905' },
    ],
    appointment: [
      { id: 1, name: 'Tom Brown', email: 'tom@example.com', date: '2023-10-06', status: 'Approved', phone: '+1 234 567 8906' },
    ],
    membership: [
      { id: 1, name: 'Lisa Green', email: 'lisa@example.com', date: '2023-10-07', status: 'Pending', phone: '+1 234 567 8907' },
    ],
    buyer: [
      { id: 1, name: 'David Lee', email: 'david@example.com', date: '2023-10-08', status: 'Approved', phone: '+1 234 567 8908' },
    ],
    seller: [
      { id: 1, name: 'Emma White', email: 'emma@example.com', date: '2023-10-09', status: 'Pending', phone: '+1 234 567 8909' },
    ],
    trade: [
      { id: 1, name: 'Chris Black', email: 'chris@example.com', date: '2023-10-10', status: 'Approved', phone: '+1 234 567 8910' },
    ],
  };

  const handleEmail = (item) => {
    // Mock email functionality
    alert(`Email sent to ${item.email}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'Pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'Rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Forms Data Management</h1>
          <p className="mt-1 text-slate-600">Manage and monitor all form submissions across different categories</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors soft-shadow">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export All
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 premium-shadow transform hover:scale-105">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Bulk Email
          </button>
        </div>
      </div>

      {/* Filter Dropdown & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 premium-shadow overflow-hidden">
        {/* Filter Section */}
        <div className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">Select Form Category:</label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none soft-shadow"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label} ({tab.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Tab Info */}
        <div className="bg-linear-to-r from-blue-50 to-purple-50 border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Viewing:</p>
              <p className="text-lg font-semibold text-slate-900">
                {tabs.find(t => t.id === activeTab)?.label} 
                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-linear-to-r from-blue-100 to-purple-100 text-blue-700">
                  {tabs.find(t => t.id === activeTab)?.count} entries
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-slate-100 to-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(mockData[activeTab] || []).map((item) => (
                <tr key={item.id} className="hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border soft-shadow ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1.5">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEmail(item)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Send Email"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {(!mockData[activeTab] || mockData[activeTab].length === 0) && (
          <div className="text-center py-12 bg-slate-50">
            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No data available</h3>
            <p className="mt-1 text-sm text-slate-500">No form submissions found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormsData;