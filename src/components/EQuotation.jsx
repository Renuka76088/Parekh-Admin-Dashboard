import { useState, useEffect } from 'react';
import {
  ChevronDownIcon, GlobeAltIcon, CheckIcon,
  PencilIcon, TrashIcon, PlusIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { equotationApi } from '../utils/api';

const EQuotation = () => {
  const websites = [
    { id: 'ParekhChamberofTextile01', name: 'Chamber of Textile' },
    { id: 'ParekheTradeMarket02', name: 'e-Trade Market' },
    { id: 'ParekhSouthernPolyfabrics03', name: 'Southern Polyfabrics' },
    { id: 'ParekhLinen04', name: 'Linen' },
    { id: 'ParekhRayon05', name: 'Rayon' },
    { id: 'ParekhFabrics06', name: 'Fabrics' },
    { id: 'ParekhSilk07', name: 'Silk' },
  ];

  const [user] = useState(JSON.parse(localStorage.getItem('hc_admin_user') || '{}'));
  const [selectedWebsite, setSelectedWebsite] = useState(user.siteId && user.siteId !== 'all' ? user.siteId : websites[0].id);

  const [loading, setLoading] = useState(true);
  const [quotations, setQuotations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    siteId: '',
    _id: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await equotationApi.list(selectedWebsite);
      setQuotations(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
    resetForm();
  }, [selectedWebsite]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      siteId: selectedWebsite,
      _id: null
    });
  };

  const handleEdit = (quote) => {
    setFormData({
      title: quote.title || '',
      description: quote.description || '',
      date: quote.date ? new Date(quote.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      siteId: quote.siteId,
      _id: quote._id
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) return;
    try {
      await equotationApi.delete(id);
      setMessage({ type: 'success', text: 'Quotation deleted successfully!' });
      fetchQuotations();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete quotation.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setMessage({ type: 'error', text: 'Listing Title and Description are required.' });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage({ type: '', text: '' });

      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        siteId: formData.siteId
      };

      if (formData._id) {
        await equotationApi.update(formData._id, payload);
        setMessage({ type: 'success', text: 'e-Quotation updated successfully!' });
      } else {
        await equotationApi.add(payload);
        setMessage({ type: 'success', text: 'e-Quotation created successfully!' });
      }

      resetForm();
      fetchQuotations();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save e-Quotation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">CMS Management</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">e-Quotation Portal</h2>
          <p className="mt-1 text-slate-500 font-medium">Manage multiple quotation requests for each platform.</p>
        </div>

        {user.siteId === 'all' && (
          <div className="relative group min-w-[250px]">
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
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="premium-card p-8 md:p-12 space-y-10 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            {formData._id ? 'Edit Quotation Listing' : 'Create New Request'}
          </h3>
          {formData._id && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 text-xs font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" /> Cancel Edit
            </button>
          )}
        </div>

        {message.text && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            {message.type === 'success' && <CheckIcon className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">
                  Listing Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="clean-input font-bold text-slate-900"
                  placeholder="Enter Title..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">
                  Quotation Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="clean-input font-bold text-slate-900"
                />
              </div>
            </div>
            <div className="quill-wrapper h-full flex flex-col">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">
                Listing Description
              </label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(content) => setFormData({ ...formData, description: content })}
                modules={quillModules}
                className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-1 min-h-[150px]"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="premium-btn-primary px-10 py-4 shadow-xl shadow-indigo-100 disabled:opacity-70 flex items-center gap-3"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : formData._id ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <PlusIcon className="w-5 h-5" />
            )}
            <span>{formData._id ? 'Update Quotation' : 'Create Request'}</span>
          </button>
        </div>
      </form>

      {/* List Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Requests</h3>
          <div className="h-0.5 bg-slate-100 flex-1"></div>
        </div>

        {loading ? (
          <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Requests...</p>
          </div>
        ) : quotations.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No requests found for this platform.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotations.map((quote) => (
              <div key={quote._id} className="premium-card p-6 bg-white flex gap-6 group hover:border-indigo-500 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-black text-slate-900 truncate uppercase tracking-tight">{quote.title}</h4>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(quote)}
                        className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quote._id)}
                        className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    {new Date(quote.date).toLocaleDateString()}
                  </div>
                  <div
                    className="text-xs text-slate-500 line-clamp-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: quote.description }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EQuotation;
