import { useState, useEffect, useMemo } from 'react';
import {
    EnvelopeIcon, EyeIcon, ClockIcon, FunnelIcon,
    ArrowTopRightOnSquareIcon, MagnifyingGlassIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { formsApi } from '../utils/api';

const FormsData = () => {
    const [activeTab, setActiveTab] = useState('trade');
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedSite, setSelectedSite] = useState('All Sites');
    const [searchQuery, setSearchQuery] = useState('');
    const [errors, setErrors] = useState({ site: false, category: false });

    const tabs = [
        { id: 'trade', label: 'Trade Enquiry' },
        { id: 'quotation', label: 'E-Quotation' },
        { id: 'auction', label: 'E-Auction' },
        { id: 'appointment', label: 'Appointment' },
        { id: 'buyer', label: 'E-Buyer' },
        { id: 'seller', label: 'E-Seller' },
        { id: 'contact', label: 'Contact Us' },
        { id: 'bulk', label: 'Bulk Seller' },
        { id: 'membership', label: 'Membership Enquiry' },
    ];

    const websites = [
        { id: 'All Sites', name: 'All Sites' },
        { id: 'ParekhChamberofTextile01', name: 'Chamber of Textile' },
        { id: 'ParekheTradeMarket02', name: 'e-Trade Market' },
        { id: 'ParekhSouthernPolyfabrics03', name: 'Southern Polyfabrics' },
        { id: 'ParekhLinen04', name: 'Linen' },
        { id: 'ParekhRayon05', name: 'Rayon' },
        { id: 'ParekhFabrics06', name: 'Fabrics' },
        { id: 'ParekhSilk07', name: 'Silk' },
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

            const [trade, quot, auc, appt, buyer, seller, contact, bulk, member] = await Promise.all([
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

            setData({ trade, quotation: quot, auction: auc, appointment: appt, buyer, seller, contact, bulk, membership: member });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const categoryCounts = useMemo(() => {
        const counts = {};
        tabs.forEach(tab => {
            const records = data[tab.id] || [];
            if (selectedSite === 'All Sites') {
                counts[tab.id] = records.length;
            } else {
                counts[tab.id] = records.filter(item => item.siteId === selectedSite).length;
            }
        });
        return counts;
    }, [data, selectedSite]);

    const filteredData = useMemo(() => {
        let currentTabData = data[activeTab] || [];

        // Site filter
        if (selectedSite !== 'All Sites') {
            currentTabData = currentTabData.filter(item => item.siteId === selectedSite);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            currentTabData = currentTabData.filter(item =>
                (item.name || item.traderName || item.visitorName || '').toLowerCase().includes(query) ||
                (item.email || item.emailId || '').toLowerCase().includes(query) ||
                (item.mobile || item.mobileNo || '').toLowerCase().includes(query)
            );
        }

        return currentTabData;
    }, [data, activeTab, selectedSite, searchQuery]);

    const handleEmail = (item) => {
        window.location.href = `mailto:${item.email || item.emailId}`;
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header & Stats */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Communications Center</span>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Form Inboxes</h2>
                    <p className="mt-1 text-slate-500 font-medium">Processing submissons from all 7 Parekh ecosystem platforms.</p>
                </div>

                <div className="flex gap-3">
                    <div className="px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Queue Status</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-slate-900">
                                {Object.values(categoryCounts).reduce((a, b) => a + b, 0)}
                            </span>
                            <div className="flex gap-0.5">
                                <div className="w-1 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                                <div className="w-1 h-3 bg-indigo-400 rounded-full animate-pulse delay-75"></div>
                                <div className="w-1 h-3 bg-indigo-300 rounded-full animate-pulse delay-150"></div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={fetchAllData}
                        className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center shadow-lg active:scale-95"
                    >
                        Sync Data
                    </button>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.category ? 'text-rose-500' : 'text-slate-400'}`}>
                        Category Selector {errors.category && <span className="ml-2">— Required</span>}
                    </label>
                    <div className="relative group">
                        <select
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                            className={`clean-input pr-10 appearance-none font-bold text-slate-900 cursor-pointer shadow-sm ${errors.category ? 'error' : ''}`}
                        >
                            {tabs.map(tab => (
                                <option key={tab.id} value={tab.id}>{tab.label} ({categoryCounts[tab.id]})</option>
                            ))}
                        </select>
                        <FunnelIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                    </div>
                </div>

                <div className="md:col-span-4">
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.site ? 'text-rose-500' : 'text-slate-400'}`}>
                        Source Website {errors.site && <span className="ml-2">— Selection Missing</span>}
                    </label>
                    <div className="relative group">
                        <select
                            value={selectedSite}
                            onChange={(e) => setSelectedSite(e.target.value)}
                            className={`clean-input pr-10 appearance-none font-bold text-slate-900 cursor-pointer shadow-sm ${errors.site ? 'error' : ''}`}
                        >
                            {websites.map(site => (
                                <option key={site.id} value={site.id}>{site.name}</option>
                            ))}
                        </select>
                        <ArrowTopRightOnSquareIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                    </div>
                </div>

                <div className="md:col-span-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">Search Records</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Refine by name, email or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="clean-input pl-11 font-medium bg-slate-50 border-slate-200"
                        />
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender Details</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Inquiry Type</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Time</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-4"></div>
                                        <p className="text-sm font-bold text-slate-500">Querying Server Inboxes...</p>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-slate-50 p-6 rounded-full border border-slate-100 mb-4">
                                                <ExclamationCircleIcon className="h-10 w-10 text-slate-200" />
                                            </div>
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight">No Submissions Found</h4>
                                            <p className="text-sm text-slate-400 font-medium mt-1">Try adjusting your website or category filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <span className="text-[10px] font-black text-indigo-600 px-3 py-1.5 bg-indigo-50/50 border border-indigo-100 rounded-full tracking-tighter uppercase">
                                                {item.siteId?.replace('Parekh', '') || 'Global'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {item.traderName || item.visitorName || item.buyerName || item.sellerName || item.participantName || item.name || item.applicantName || 'Anonymous Sender'}
                                                </span>
                                                <span className="text-[11px] text-slate-500 font-medium">
                                                    {item.email || item.emailId}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">
                                                    {activeTab === 'trade' && (item.enquiryType || 'Trade Inquiry')}
                                                    {activeTab === 'quotation' && (item.quotationType || 'E-Quotation Request')}
                                                    {activeTab === 'bulk' && (item.productType || 'Bulk Fulfillment')}
                                                    {activeTab === 'appointment' && (item.reasonForVisit || 'Official Visit')}
                                                    {activeTab === 'buyer' && (item.categoryOfBusiness || 'Procurement')}
                                                    {activeTab === 'seller' && (item.categoryOfBusiness || 'Fulfillment')}
                                                    {activeTab === 'contact' && 'General Contact'}
                                                    {activeTab === 'auction' && 'Auction Desk'}
                                                    {activeTab === 'membership' && (item.categoryOfBusiness || 'Membership Enrollment')}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                    {item.mobileNo || item.mobile || item.phone || 'No Mobile'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black">
                                                <ClockIcon className="h-3 w-3 text-slate-400" />
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'Archive'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEmail(item)}
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                                                    title="Quick Email"
                                                >
                                                    <EnvelopeIcon className="h-5 w-5" />
                                                </button>
                                                {(item.gstCertificate || item.proofFile || item.uploadedDocument || (item.kycDocuments && item.kycDocuments[0])) ? (
                                                    <a
                                                        href={`http://localhost:5000/${item.gstCertificate || item.proofFile || item.uploadedDocument || (item.kycDocuments && item.kycDocuments[0])}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                        title="View Doc"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </a>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                )
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FormsData;