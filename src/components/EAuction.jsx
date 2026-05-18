import { useState, useEffect } from 'react';
import {
  ChevronDownIcon, GlobeAltIcon, CheckIcon, CloudArrowUpIcon, PhotoIcon,
  PencilIcon, TrashIcon, PlusIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { eauctionApi, eauctionHeaderApi } from '../utils/api';

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
  const [auctions, setAuctions] = useState([]);
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

  const [headerData, setHeaderData] = useState({ title: '', description: '' });
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [headerMessage, setHeaderMessage] = useState({ type: '', text: '' });

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const res = await eauctionApi.list(selectedWebsite);
      setAuctions(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeader = async () => {
    try {
      const res = await eauctionHeaderApi.get(selectedWebsite);
      if (res.data.success && res.data.data) {
        setHeaderData({
          title: res.data.data.title || '',
          description: res.data.data.description || ''
        });
      }
    } catch (error) {
      console.error("Fetch Header Error:", error);
    }
  };

  const handleHeaderSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSavingHeader(true);
      setHeaderMessage({ type: '', text: '' });
      await eauctionHeaderApi.update(selectedWebsite, headerData);
      setHeaderMessage({ type: 'success', text: 'Page Header updated successfully!' });
    } catch (error) {
      setHeaderMessage({ type: 'error', text: 'Failed to update Page Header.' });
    } finally {
      setIsSavingHeader(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
    fetchHeader();
    resetForm();
  }, [selectedWebsite]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      image: null,
      siteId: selectedWebsite,
      _id: null
    });
    setPreviewImage(null);
  };

  const handleEdit = (auction) => {
    setFormData({
      title: auction.title || '',
      description: auction.description || '',
      date: auction.date ? new Date(auction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      image: null,
      siteId: auction.siteId,
      _id: auction._id
    });
    setPreviewImage(auction.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this auction?')) return;
    try {
      await eauctionApi.delete(id);
      setMessage({ type: 'success', text: 'Auction deleted successfully!' });
      fetchAuctions();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete auction.' });
    }
  };

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
        setMessage({ type: 'success', text: 'e-Auction updated successfully!' });
      } else {
        await eauctionApi.add(data);
        setMessage({ type: 'success', text: 'e-Auction created successfully!' });
      }

      resetForm();
      fetchAuctions();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save e-Auction.' });
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
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">e-Auction Portal</h2>
          <p className="mt-1 text-slate-500 font-medium">Manage multiple liquidation listings for each platform.</p>
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

      {/* Page Header Editor */}
      <form onSubmit={handleHeaderSubmit} className="premium-card p-6 md:p-8 space-y-6 bg-white border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Page Header Settings
            </h3>
            <p className="text-xs text-slate-400 font-medium">Modify the title and description shown on the user portal's e-Auction page.</p>
          </div>
        </div>

        {headerMessage.text && (
          <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-xs ${headerMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            {headerMessage.type === 'success' && <CheckIcon className="w-4 h-4" />}
            {headerMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">
              Portal Header Title
            </label>
            <input
              type="text"
              value={headerData.title}
              onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
              className="clean-input font-bold text-slate-900"
              placeholder="e.g. e-Auction"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2">
              Portal Header Description (Max 2 lines recommended)
            </label>
            <textarea
              value={headerData.description}
              onChange={(e) => setHeaderData({ ...headerData, description: e.target.value })}
              className="clean-input font-bold text-slate-900 resize-none"
              placeholder="Enter short description..."
              rows={2}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSavingHeader}
            className="premium-btn-primary px-8 py-3 text-xs shadow-md disabled:opacity-70 flex items-center gap-2"
          >
            {isSavingHeader ? (
              <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckIcon className="w-4 h-4" />
            )}
            <span>Save Header Settings</span>
          </button>
        </div>
      </form>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="premium-card p-8 md:p-12 space-y-10 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            {formData._id ? 'Edit Auction Listing' : 'Create New Listing'}
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
          {/* Image Upload Section */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-3">Auction Media</h3>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-48 h-48 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden relative group">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <PhotoIcon className="w-10 h-10 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-center px-4">No Image</span>
                  </div>
                )}
                <label className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  <CloudArrowUpIcon className="w-8 h-8 text-white" />
                </label>
              </div>
              <div className="flex-1 space-y-4">
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-2">Requirements</h4>
                  <ul className="text-[11px] text-indigo-700 font-medium space-y-1">
                    <li>• JPG, PNG, WEBP allowed</li>
                    <li>• Max file size: 5MB</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
                >
                  Change Image
                </button>
              </div>
            </div>
          </div>

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
                  placeholder="Enter Auction Title..."
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
            <span>{formData._id ? 'Update Auction' : 'Create Auction'}</span>
          </button>
        </div>
      </form>

      {/* List Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Listings</h3>
          <div className="h-0.5 bg-slate-100 flex-1"></div>
        </div>

        {loading ? (
          <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Listings...</p>
          </div>
        ) : auctions.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No listings found for this platform.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {auctions.map((auction) => (
              <div key={auction._id} className="premium-card p-6 bg-white flex gap-6 group hover:border-indigo-500 transition-all">
                {auction.image && (
                  <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                    <img src={auction.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-black text-slate-900 truncate uppercase tracking-tight">{auction.title}</h4>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(auction)}
                        className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(auction._id)}
                        className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    {new Date(auction.date).toLocaleDateString()}
                  </div>
                  <div
                    className="text-xs text-slate-500 line-clamp-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: auction.description }}
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

export default EAuction;
