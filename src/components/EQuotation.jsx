import { useState, useEffect } from 'react';
import {
  PlusIcon, PencilIcon, TrashIcon, XMarkIcon,
  ChevronDownIcon, GlobeAltIcon, DocumentTextIcon
} from '@heroicons/react/24/outline';
import { equotationApi } from '../utils/api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const EQuotation = () => {
  const websites = [
    { id: 'all', name: 'All Platforms' },
    { id: 'ParekhChamberofTextile01', name: 'Chamber of Textile' },
    { id: 'ParekheTradeMarket02', name: 'e-Trade Market' },
    { id: 'ParekhSouthernPolyfabrics03', name: 'Southern Polyfabrics' },
    { id: 'ParekhLinen04', name: 'Linen' },
    { id: 'ParekhRayon05', name: 'Rayon' },
    { id: 'ParekhFabrics06', name: 'Fabrics' },
    { id: 'ParekhSilk07', name: 'Silk' },
  ];

  const [user] = useState(JSON.parse(localStorage.getItem('hc_admin_user') || '{}'));
  const [selectedWebsite, setSelectedWebsite] = useState(user.siteId || 'all');

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    siteId: user.siteId || 'ParekheTradeMarket02',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await equotationApi.list(selectedWebsite === 'all' ? '' : selectedWebsite);
      setQuotations(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [selectedWebsite]);

  const handleAdd = () => {
    setEditingQuotation(null);
    setFormData({
      title: '',
      description: '',
      siteId: user.siteId || 'ParekheTradeMarket02',
      status: 'active'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (quotation) => {
    setEditingQuotation(quotation);
    setFormData({ ...quotation });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this e-Quotation listing?")) {
      try {
        await equotationApi.delete(id);
        fetchQuotations();
      } catch (error) {
        alert("Operation failed: Could not delete listing.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      title: !formData.title,
      siteId: !formData.siteId,
      description: !formData.description || formData.description === '<p><br></p>',
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(v => v)) return;

    try {
      setIsSubmitting(true);
      if (editingQuotation) {
        await equotationApi.update(editingQuotation._id, formData);
      } else {
        await equotationApi.add(formData);
      }
      setShowModal(false);
      fetchQuotations();
    } catch (error) {
      alert("System fault: e-Quotation provisioning failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Management</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">e-Quotation Listings</h2>
            <p className="mt-1 text-slate-500 font-medium">Create and manage electronic quotation opportunities.</p>
          </div>

          <div className="flex items-center gap-4">
            {user.siteId === 'all' && (
              <div className="relative group min-w-[200px]">
                <select
                  value={selectedWebsite}
                  onChange={(e) => setSelectedWebsite(e.target.value)}
                  className="clean-input pr-10 appearance-none font-bold text-slate-900 cursor-pointer shadow-sm bg-white"
                >
                  {websites.map(site => <option key={site.id} value={site.id}>{site.name}</option>)}
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
              </div>
            )}
            <button onClick={handleAdd} className="premium-btn-primary gap-2">
              <PlusIcon className="h-5 w-5" />
              Add e-Quotation
            </button>
          </div>
        </div>

        {/* Quotation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="text-sm font-bold text-slate-500 mt-4">Consulting Database...</p>
            </div>
          ) : quotations.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="bg-slate-50 p-6 rounded-[2.5rem] inline-block border border-slate-100">
                <GlobeAltIcon className="w-10 h-10 text-slate-200" />
              </div>
              <h4 className="text-lg font-black text-slate-900 mt-4 tracking-tight">No e-Quotation Listings Found</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Start by creating a new quotation.</p>
            </div>
          ) : (
            quotations.map((quotation) => (
              <div key={quotation._id} className="premium-card p-8 group relative transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 flex flex-col h-full bg-gradient-to-br from-white to-slate-50/30">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest mb-2 block w-fit">
                      {quotation.siteId?.replace('Parekh', '') || 'General'}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
                      {quotation.title}
                    </h4>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => handleEdit(quotation)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all border border-slate-100 hover:border-indigo-100">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(quotation._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all border border-slate-100 hover:border-rose-100">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-6 mb-6 flex-1">
                  <div className="flex-1 text-sm text-slate-600 line-clamp-6 overflow-hidden" dangerouslySetInnerHTML={{ __html: quotation.description }}>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100/60 mt-auto">
                   <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${quotation.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{quotation.status}</span>
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Created: {new Date(quotation.createdAt).toLocaleDateString()}
                   </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)} />
          
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-scale-in max-h-full">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingQuotation ? 'Update e-Quotation' : 'New e-Quotation Init'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Quotation Configuration</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.title ? 'text-rose-500' : 'text-slate-500'}`}>
                    Quotation Title {errors.title && '— Required'}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`clean-input font-bold text-slate-900 ${errors.title ? 'error' : ''}`}
                    placeholder="e.g. Bulk Polyfabric Supply June 2024"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {user.siteId === 'all' && (
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Target Platform</label>
                        <div className="relative group">
                        <select
                            value={formData.siteId}
                            onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                            className="clean-input pr-10 appearance-none font-bold text-slate-900 shadow-sm"
                        >
                            {websites.filter(s => s.id !== 'all').map((site) => (
                            <option key={site.id} value={site.id}>{site.name}</option>
                            ))}
                        </select>
                        <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                        </div>
                    </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Current Status</label>
                        <div className="relative group">
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="clean-input pr-10 appearance-none font-bold text-slate-900 shadow-sm"
                        >
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                        </select>
                        <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                        </div>
                    </div>
                </div>

                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.description ? 'text-rose-500' : 'text-slate-500'}`}>
                    Quotation Description {errors.description && '— Required'}
                  </label>
                  <div className="h-[250px] mb-12">
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(content) => setFormData({ ...formData, description: content })}
                      modules={{
                        toolbar: [
                          ['bold', 'italic', 'underline'],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                          ['clean']
                        ],
                      }}
                      className="bg-slate-50 rounded-2xl overflow-hidden border-slate-200 h-full flex flex-col"
                      placeholder="Specify quotation requirements, technical specs, and deadlines..."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full premium-btn-primary py-5 text-lg shadow-xl shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Provisioning...</span>
                    </>
                  ) : (
                    editingQuotation ? 'Authorize Quotation Update' : 'Command Quotation Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EQuotation;
