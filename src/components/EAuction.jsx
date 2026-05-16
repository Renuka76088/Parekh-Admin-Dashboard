import { useState, useEffect } from 'react';
import {
  ChevronDownIcon, GlobeAltIcon, CheckIcon, CloudArrowUpIcon, PhotoIcon
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { eauctionApi } from '../utils/api';

const EAuction = () => {
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
    date: new Date().toISOString().split('T')[0],
    image: null,
    siteId: '',
    _id: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchAuction = async () => {
    try {
      setLoading(true);
      const res = await eauctionApi.list(selectedWebsite);
      const auction = res.data.data && res.data.data.length > 0 ? res.data.data[0] : null;

      if (auction) {
        setFormData({
          title: auction.title || '',
          description: auction.description || '',
          date: auction.date ? new Date(auction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          image: null,
          siteId: auction.siteId,
          _id: auction._id
        });
        setPreviewImage(auction.image);
      } else {
        setFormData({
          title: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          image: null,
          siteId: selectedWebsite,
          _id: null
        });
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [selectedWebsite]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
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

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('date', formData.date);
      data.append('siteId', formData.siteId);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (formData._id) {
        await eauctionApi.update(formData._id, data);
      } else {
        await eauctionApi.add(data);
      }

      setMessage({ type: 'success', text: 'e-Auction updated successfully!' });
      fetchAuction();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update e-Auction.' });
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
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">e-Auction Content</h2>
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
            {/* Image Upload Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-3">Auction Media</h3>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-64 h-64 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden relative group">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <PhotoIcon className="w-12 h-12 mb-2" />
                      <span className="text-[10px] font-black uppercase">No Image Selected</span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    <CloudArrowUpIcon className="w-10 h-10 text-white" />
                  </label>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                    <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-2">Image Requirements</h4>
                    <ul className="text-[11px] text-indigo-700 font-medium space-y-1">
                      <li>• Recommended size: 1200 x 800px</li>
                      <li>• Formats: JPG, PNG, WEBP</li>
                      <li>• Max file size: 5MB</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    Select New Image
                  </button>
                </div>
              </div>
            </div>

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
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">
                  Auction Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="clean-input font-bold text-slate-900"
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

export default EAuction;
