import { useState, useEffect, useMemo } from 'react';
import { EnvelopeIcon, EyeIcon, CheckCircleIcon, ClockIcon, XCircleIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { formsApi } from '../utils/api';

const FormsData = () => {
  const [activeTab, setActiveTab] = useState('trade');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState('All Sites');

  const tabs = [
    { id: 'trade', label: 'Trade Enquiry' },
    { id: 'quotation', label: 'E-Quotation' },
    { id: 'auction', label: 'E-Auction' },
    { id: 'appointment', label: 'Appointment' },
    { id: 'buyer', label: 'E-Buyer' },
    { id: 'seller', label: 'E-Seller' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'bulk', label: 'Bulk Seller' },
  ];

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const fetchWithCatch = async (apiCall) => {
        try {
          const res = await apiCall();
          return res.data.data || [];
        } catch (e) {
          console.error("API Call failed:", e.config?.url);
          return [];
        }
      };

      const [trade, quot, auc, appt, buyer, seller, contact, bulk] = await Promise.all([
        fetchWithCatch(formsApi.getTradeEnquiries),
        fetchWithCatch(formsApi.getQuotations),
        fetchWithCatch(formsApi.getAuctions),
        fetchWithCatch(formsApi.getAppointments),
        fetchWithCatch(formsApi.getBuyerSubmissions),
        fetchWithCatch(formsApi.getSellerSubmissions),
        fetchWithCatch(formsApi.getContactSubmissions),
        fetchWithCatch(formsApi.getBulkSellers),
      ]);

      setData({
        trade,
        quotation: quot,
        auction: auc,
        appointment: appt,
        buyer,
        seller,
        contact,
        bulk
      });
    } catch (error) {
      console.error("Error fetching forms data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const websites = [
    { id: 'All Sites', name: 'All Sites' },
    { id: 'ParekhChamberofTextile01', name: 'Parekh Chamber of Textile' },
    { id: 'ParekhETradeMarket02', name: 'Parekh e-Trade Market' },
    { id: 'ParekhSouthernPolyfabrics03', name: 'Parekh Southern Polyfabrics' },
    { id: 'ParekhLinen04', name: 'Parekh Linen' },
    { id: 'ParekhRayon05', name: 'Parekh Rayon' },
    { id: 'ParekhFabrics06', name: 'Parekh Fabrics' },
    { id: 'ParekhSilk07', name: 'Parekh Silk' },
  ];

  const filteredData = useMemo(() => {
    const currentTabData = data[activeTab] || [];
    if (selectedSite === 'All Sites') return currentTabData;
    return currentTabData.filter(item => item.siteId === selectedSite);
  }, [data, activeTab, selectedSite]);

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
          <button className="inline-flex items-center px-4 py-2 bg-linear-to-r from-sky-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-sky-700 hover:to-blue-800 transition-all duration-200 premium-shadow transform hover:scale-105">
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="text-sm font-semibold text-slate-700">Category:</label>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none soft-shadow min-w-[180px]"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label} ({data[tab.id]?.length || 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center text-sm font-semibold text-slate-700">
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filter Site:
              </div>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none soft-shadow min-w-[220px]"
              >
                {websites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Tab Info */}
        <div className="bg-linear-to-r from-sky-50 to-blue-50 border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-slate-900">
                Viewing: <span className="text-blue-600 uppercase font-bold">{activeTab}</span>
              </p>
              <span className="h-4 w-px bg-slate-300"></span>
              <p className="text-sm font-medium text-slate-900">
                Site: <span className="text-blue-600 font-bold">{selectedSite}</span>
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-tight">
              {filteredData.length} records found
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-slate-600 font-medium">Fetching secure data from server...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-linear-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-widest">Site ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-widest">Client Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-widest">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-widest">Date Submitted</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredData.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-blue-600 px-2 py-1 bg-blue-50 border border-blue-100 rounded-md">
                        {item.siteId || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">
                          {item.traderName || item.visitorName || item.buyerName || item.sellerName || item.participantName || item.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {item.businessName || item.legalBusinessName || item.businessTitle || item.businessAddress?.substring(0, 20) || 'Individual'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-700 font-medium">{item.email || item.emailId || 'N/A'}</span>
                        <span className="text-xs text-slate-500">{item.mobileNo || item.mobile || item.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900 font-semibold">
                          {activeTab === 'trade' && (item.enquiryType || 'General')}
                          {activeTab === 'quotation' && (item.quotationType || 'General')}
                          {activeTab === 'bulk' && (item.productType || 'Bulk')}
                          {activeTab === 'appointment' && (item.reasonForVisit || 'Visit')}
                          {activeTab === 'buyer' && (item.categoryOfBusiness || 'Buyer')}
                          {activeTab === 'seller' && (item.categoryOfBusiness || 'Seller')}
                          {activeTab === 'contact' && 'Contact Msg'}
                          {activeTab === 'auction' && 'Auction Participation'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.gstNo || item.quantity || item.requiredQuantity || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-600 font-medium">
                        <ClockIcon className="h-4 w-4 mr-2 text-slate-400" />
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEmail(item)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 group"
                          title="Reply via Email"
                        >
                          <EnvelopeIcon className="h-4 w-4" />
                          <span className="text-xs font-bold">Reply</span>
                        </button>
                        {item.gstCertificate || item.proofFile || item.kycDocuments?.length > 0 ? (
                          <a
                            href={`http://localhost:5000/${item.gstCertificate || item.proofFile || (item.kycDocuments && item.kycDocuments[0])}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-400 hover:text-blue-900 transition-colors duration-200"
                            title="View Document"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </a>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Empty state */}
        {!loading && filteredData.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
              <EnvelopeIcon className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">No submissions found</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
              There are no {activeTab} records available for <span className="font-bold text-slate-700">{selectedSite}</span> at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormsData;

const customStyles = `
  .soft-shadow {
    box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
  }
  .premium-shadow {
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
  }
`;