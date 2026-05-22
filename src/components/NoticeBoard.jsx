import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  PlusIcon, PencilIcon, TrashIcon, BellIcon, 
  XMarkIcon, CalendarIcon, ChevronDownIcon,
  MegaphoneIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';
import { noticeApi } from '../utils/api';

const NoticeBoard = () => {
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
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    siteId: user.siteId || 'ParekheTradeMarket02',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await noticeApi.list(selectedWebsite === 'all' ? '' : selectedWebsite);
      setNotices(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [selectedWebsite]);

  const handleAdd = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      siteId: user.siteId === 'all' ? (selectedWebsite === 'all' ? 'ParekheTradeMarket02' : selectedWebsite) : user.siteId,
      status: 'active'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      ...notice,
      date: new Date(notice.date).toISOString().split('T')[0]
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Archive this notice? it will be removed from the public notice board.")) {
      try {
        await noticeApi.delete(id);
        fetchNotices();
      } catch (error) {
        alert("Operation denied: Server protocol violation.");
      }
    }
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
      if (editingNotice) {
        await noticeApi.update(editingNotice._id, formData);
      } else {
        await noticeApi.add(formData);
      }
      setShowModal(false);
      fetchNotices();
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
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Communication Hub</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Notice Board</h2>
          <p className="mt-1 text-slate-500 font-medium">Broadcast critical announcements and updates across platforms.</p>
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
            New Announcement
          </button>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-sm font-bold text-slate-500 mt-4">Syncing Notice Board...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="bg-slate-50 p-6 rounded-[2rem] inline-block border border-slate-100">
              <MegaphoneIcon className="w-10 h-10 text-slate-200" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mt-4 tracking-tight">No Active Notices</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Broadcast your first update to the ecosystem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {notices.map((notice) => (
              <div key={notice._id} className="premium-card p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 transition-all group-hover:w-2"></div>
                
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                  <BellIcon className="h-7 w-7" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                      {notice.siteId?.replace('Parekh', '')}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <CalendarIcon className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {new Date(notice.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">
                    {notice.title}
                  </h4>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2">
                    {notice.description}
                  </p>
                </div>

                <div className="flex gap-2 self-end md:self-center">
                  <button onClick={() => handleEdit(notice)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all border border-slate-100 hover:border-indigo-100">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(notice._id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all border border-slate-100 hover:border-rose-100">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
          {/* Enhanced Backdrop */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col animate-scale-in max-h-[90vh]">
            <div className="p-4 sm:p-6 md:px-8 md:py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {editingNotice ? 'Edit Announcement' : 'Post New Notice'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Broadcast Configuration</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 min-h-0 space-y-6 custom-scrollbar">
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.title ? 'text-rose-500' : 'text-slate-500'}`}>
                  Notice Heading {errors.title && '— Required'}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`clean-input font-bold text-slate-900 ${errors.title ? 'error' : ''}`}
                  placeholder="e.g. Annual General Meeting 2026"
                />
              </div>

              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.description ? 'text-rose-500' : 'text-slate-500'}`}>
                  Brief Description {errors.description && '— Required'}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`clean-input font-medium text-slate-800 h-28 resize-none leading-relaxed py-4 ${errors.description ? 'error' : ''}`}
                  placeholder="Short summary of the notice..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Display Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="clean-input font-bold text-slate-900"
                  />
                </div>

                {user.siteId === 'all' && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Host Platform</label>
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
              </div>

              <div className="pt-4 pb-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full premium-btn-primary py-4 text-sm shadow-xl shadow-indigo-100 disabled:opacity-70 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    editingNotice ? 'Save Changes' : 'Broadcast Notice'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default NoticeBoard;
