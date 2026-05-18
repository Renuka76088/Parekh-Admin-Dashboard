import { useState, useEffect } from 'react';
import { 
  PlusIcon, PencilIcon, TrashIcon, DocumentDuplicateIcon, 
  XMarkIcon, ChevronDownIcon, CheckCircleIcon,
  ListBulletIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';
import { tenderApi, tenderHeaderApi } from '../utils/api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const Tenders = () => {
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
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTender, setEditingTender] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keyPoints: [],
    siteId: user.siteId || 'ParekheTradeMarket02',
    status: 'active'
  });
  const [newPoint, setNewPoint] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [headerData, setHeaderData] = useState({ title: '', description: '' });
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [headerMessage, setHeaderMessage] = useState({ type: '', text: '' });

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const res = await tenderApi.list(selectedWebsite === 'all' ? '' : selectedWebsite);
      setTenders(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeader = async () => {
    if (selectedWebsite === 'all') return;
    try {
      const res = await tenderHeaderApi.get(selectedWebsite);
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
    if (selectedWebsite === 'all') return;
    try {
      setIsSavingHeader(true);
      setHeaderMessage({ type: '', text: '' });
      await tenderHeaderApi.update(selectedWebsite, headerData);
      setHeaderMessage({ type: 'success', text: 'Page Header updated successfully!' });
    } catch (error) {
      setHeaderMessage({ type: 'error', text: 'Failed to update Page Header.' });
    } finally {
      setIsSavingHeader(false);
    }
  };

  useEffect(() => {
    fetchTenders();
    fetchHeader();
  }, [selectedWebsite]);

  const handleAdd = () => {
    setEditingTender(null);
    setFormData({
      title: '',
      description: '',
      keyPoints: [],
      siteId: user.siteId === 'all' ? (selectedWebsite === 'all' ? 'ParekheTradeMarket02' : selectedWebsite) : user.siteId,
      status: 'active'
    });
    setNewPoint('');
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (tender) => {
    setEditingTender(tender);
    setFormData({ ...tender });
    setNewPoint('');
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Archive this tender? It will be removed from all live sites.")) {
      try {
        await tenderApi.delete(id);
        fetchTenders();
      } catch (error) {
        alert("Operation denied: Server protocol violation.");
      }
    }
  };

  const addKeyPoint = () => {
    if (newPoint.trim()) {
      setFormData({ ...formData, keyPoints: [...formData.keyPoints, newPoint.trim()] });
      setNewPoint('');
    }
  };

  const removeKeyPoint = (index) => {
    const updatedPoints = formData.keyPoints.filter((_, i) => i !== index);
    setFormData({ ...formData, keyPoints: updatedPoints });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      title: !formData.title,
      description: !formData.description,
      siteId: !formData.siteId
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(v => v)) return;

    try {
      setIsSubmitting(true);
      if (editingTender) {
        await tenderApi.update(editingTender._id, formData);
      } else {
        await tenderApi.add(formData);
      }
      setShowModal(false);
      fetchTenders();
    } catch (error) {
      alert("Submission aborted. Database fault.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Procurement Management</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Tenders & Contracts</h2>
          <p className="mt-1 text-slate-500 font-medium">Coordinate bidding opportunities and vendor agreements across the ecosystem.</p>
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
            Post New Tender
          </button>
        </div>
      </div>

      {/* Page Header Editor */}
      {selectedWebsite !== 'all' && (
        <form onSubmit={handleHeaderSubmit} className="premium-card p-6 md:p-8 space-y-6 bg-white border border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                Page Header Settings
              </h3>
              <p className="text-xs text-slate-400 font-medium">Modify the title and description shown on the user portal's Tenders & Contracts page.</p>
            </div>
          </div>

          {headerMessage.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-xs ${headerMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
              {headerMessage.type === 'success' && <CheckCircleIcon className="w-4 h-4" />}
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
                placeholder="e.g. TENDERS & CONTRACTS"
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
                <CheckCircleIcon className="w-4 h-4" />
              )}
              <span>Save Header Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tenders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-sm font-bold text-slate-500 mt-4">Consulting Procurement Database...</p>
          </div>
        ) : tenders.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="bg-slate-50 p-6 rounded-[2rem] inline-block border border-slate-100">
              <DocumentDuplicateIcon className="w-10 h-10 text-slate-200" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mt-4 tracking-tight">No Active Tenders</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ready to invite bids? Initialize your first tender.</p>
          </div>
        ) : (
          tenders.map((tender) => (
            <div key={tender._id} className="premium-card p-10 group relative transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 flex flex-col h-full bg-gradient-to-br from-white to-slate-50/30">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest w-fit">
                      {tender.siteId?.replace('Parekh', '') || 'Corporate'}
                    </span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border ${
                      tender.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {tender.status}
                    </span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
                    {tender.title}
                  </h4>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(tender)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all border border-slate-100 hover:border-indigo-100">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(tender._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all border border-slate-100 hover:border-rose-100">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: tender.description }} />
                
                {tender.keyPoints && tender.keyPoints.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Critical Specifications</span>
                    <div className="grid grid-cols-1 gap-2">
                      {tender.keyPoints.slice(0, 3).map((point, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-white/60 p-2 rounded-xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
                          <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span className="line-clamp-1">{point}</span>
                        </div>
                      ))}
                      {tender.keyPoints.length > 3 && (
                        <span className="text-[10px] font-bold text-indigo-400 ml-2">+{tender.keyPoints.length - 3} more points...</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                   <ListBulletIcon className="h-4 w-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{tender.keyPoints?.length || 0} Key Points</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Updated: {new Date(tender.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)} />
          
          <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col animate-scale-in max-h-[95vh]">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingTender ? 'Refine Tender Details' : 'Add New Tender'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Procurement Architecture</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 gap-10">
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-3 ${errors.title ? 'text-rose-500' : 'text-slate-500'}`}>
                    Tender Title {errors.title && '— Required'}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`clean-input font-bold text-slate-900 ${errors.title ? 'error' : ''}`}
                    placeholder="e.g. Official Tender 2026"
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-3 ${errors.description ? 'text-rose-500' : 'text-slate-500'}`}>
                    Description (Rich Text) {errors.description && '— Required'}
                  </label>
                  <div className="h-[350px] mb-12">
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(content) => setFormData({ ...formData, description: content })}
                      className="bg-slate-50 rounded-[1.5rem] overflow-hidden border-slate-200 h-full flex flex-col"
                      placeholder="Detailed tender overview and specifications..."
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3">Key Points</label>
                  
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newPoint}
                      onChange={(e) => setNewPoint(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyPoint())}
                      className="clean-input flex-1 font-bold text-slate-900 shadow-inner"
                      placeholder="Add a key point..."
                    />
                    <button 
                      type="button" 
                      onClick={addKeyPoint}
                      className="px-6 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2"
                    >
                      <PlusIcon className="h-4 w-4" /> Add
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group/point">
                        <span className="text-[11px] font-bold text-slate-700 leading-tight pr-4">{point}</span>
                        <button 
                          type="button" 
                          onClick={() => removeKeyPoint(index)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {user.siteId === 'all' && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-3">Target Platform</label>
                      <div className="relative group">
                        <select
                          value={formData.siteId}
                          onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                          className="clean-input pr-10 appearance-none font-bold text-slate-900"
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
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-3">Tender Status</label>
                    <div className="flex gap-4 p-2 bg-slate-100 rounded-2xl border border-slate-200">
                      {['active', 'closed', 'archived'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setFormData({ ...formData, status: st })}
                          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                            formData.status === st ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-5 rounded-[1.5rem] border border-slate-200 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] premium-btn-primary py-5 text-lg shadow-xl shadow-indigo-100 disabled:opacity-70 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    editingTender ? 'Save Modification' : 'Command Tender Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenders;
