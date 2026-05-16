import { useState, useEffect } from 'react';
import {
  ChevronDownIcon, GlobeAltIcon, CheckIcon
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    siteId: '',
    _id: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchQuotation = async () => {
    try {
      setLoading(true);
      const res = await equotationApi.list(selectedWebsite);
      const quotation = res.data.data && res.data.data.length > 0 ? res.data.data[0] : null;

      if (quotation) {
        setFormData({
          title: quotation.title || '',
          description: quotation.description || '',
          siteId: quotation.siteId,
          _id: quotation._id
        });
      } else {
        setFormData({
          title: '',
          description: '',
          siteId: selectedWebsite,
          _id: null
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotation();
  }, [selectedWebsite]);

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
        siteId: formData.siteId
      };

      if (formData._id) {
        await equotationApi.update(formData._id, payload);
      } else {
        await equotationApi.add(payload);
      }

      setMessage({ type: 'success', text: 'e-Quotation updated successfully!' });
      fetchQuotation();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update e-Quotation.' });
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">CMS Management</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">e-Quotation Content</h2>
          <p className="mt-1 text-slate-500 font-medium">Update the listing content and media for each platform.</p>
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

      {loading ? (
        <div className="py-24 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-500 mt-4 uppercase tracking-widest">Fetching Content...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="premium-card p-8 md:p-12 space-y-10 bg-white">
          {message.text && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
              {message.type === 'success' && <CheckIcon className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          <div className="space-y-12">
            {/* Listing Section Fields */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-3">Listing Content</h3>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">
                  Listing Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="clean-input font-bold text-slate-900 text-lg"
                  placeholder="Enter Title..."
                />
              </div>
              <div className="quill-wrapper">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">
                  Listing Description
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  modules={quillModules}
                  className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
              <GlobeAltIcon className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                Platform: {websites.find(w => w.id === selectedWebsite)?.name}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="premium-btn-primary px-10 py-4 shadow-xl shadow-indigo-100 disabled:opacity-70 flex items-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EQuotation;
