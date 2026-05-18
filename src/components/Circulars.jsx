import { useState, useEffect } from 'react';
import { 
  PlusIcon, PencilIcon, TrashIcon, 
  DocumentIcon, XMarkIcon, 
  ArrowTopRightOnSquareIcon,
  CloudArrowUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { circularApi, circularHeaderApi } from '../utils/api';

const Circulars = () => {
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
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCircular, setEditingCircular] = useState(null);
  
  const [formData, setFormData] = useState({
    subject: '',
    pdf: null,
    publishDate: '',
    siteId: user.siteId === 'all' ? 'ParekhChamberofTextile01' : user.siteId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [headerData, setHeaderData] = useState({ title: '', description: '' });
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [headerMessage, setHeaderMessage] = useState({ type: '', text: '' });

  const fetchCirculars = async () => {
    try {
      setLoading(true);
      const res = await circularApi.list(selectedWebsite === 'all' ? '' : selectedWebsite);
      if (res.data.success) {
        setCirculars(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching circulars:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeader = async () => {
    if (selectedWebsite === 'all') return;
    try {
      const res = await circularHeaderApi.get(selectedWebsite);
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
      await circularHeaderApi.update(selectedWebsite, headerData);
      setHeaderMessage({ type: 'success', text: 'Page Header updated successfully!' });
    } catch (error) {
      setHeaderMessage({ type: 'error', text: 'Failed to update Page Header.' });
    } finally {
      setIsSavingHeader(false);
    }
  };

  useEffect(() => {
    fetchCirculars();
    fetchHeader();
  }, [selectedWebsite]);

  const handleAddClick = () => {
    setEditingCircular(null);
    setFormData({ 
      subject: '', 
      pdf: null, 
      publishDate: '', 
      siteId: user.siteId === 'all' ? 'ParekhChamberofTextile01' : user.siteId 
    });
    setShowModal(true);
  };

  const handleEditClick = (circular) => {
    setEditingCircular(circular);
    setFormData({
      subject: circular.subject,
      pdf: null,
      publishDate: circular.publishDate,
      siteId: circular.siteId
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this circular?')) return;
    try {
      const res = await circularApi.delete(id);
      if (res.data.success) {
        fetchCirculars();
      }
    } catch (error) {
      console.error("Error deleting circular:", error);
      alert("Failed to delete circular.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('subject', formData.subject);
      data.append('publishDate', formData.publishDate);
      data.append('siteId', formData.siteId);
      if (formData.pdf) {
        data.append('pdf', formData.pdf);
      }

      if (editingCircular) {
        await circularApi.update(editingCircular._id, data);
      } else {
        if (!formData.pdf) {
          alert("Please upload a PDF document.");
          setIsSubmitting(false);
          return;
        }
        await circularApi.add(data);
      }

      setShowModal(false);
      fetchCirculars();
    } catch (error) {
      console.error("Error submitting circular:", error);
      alert(error.response?.data?.message || "Failed to save circular.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Internal Communications</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Official Circulars</h2>
          <p className="mt-1 text-slate-500 font-medium">Broadcast announcements and policy updates to the ecosystem.</p>
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
          <button onClick={handleAddClick} className="premium-btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Circular
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
              <p className="text-xs text-slate-400 font-medium">Modify the title and description shown on the user portal\'s Circulars page.</p>
            </div>
          </div>

          {headerMessage.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-xs ${headerMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
              {headerMessage.type === 'success' && <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px]">✓</div>}
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
                placeholder="e.g. OFFICIAL CIRCULARS"
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
              {isSavingHeader && (
                <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>Save Header Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Circulars List */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Circular Details</th>
                <th className="hidden md:table-cell px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Platform</th>
                <th className="hidden md:table-cell px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Publish Date</th>
                <th className="hidden md:table-cell px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="text-sm font-bold text-slate-500 mt-4 uppercase">Syncing Repository...</p>
                  </td>
                </tr>
              ) : circulars.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-slate-50 p-6 rounded-full border border-slate-100 mb-4">
                        <DocumentIcon className="h-10 w-10 text-slate-200" />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">No Circulars Found</h4>
                      <p className="text-sm text-slate-400 font-medium mt-1 uppercase">Start by adding your first official announcement.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                circulars.map((circ) => (
                  <tr key={circ._id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase leading-tight">
                          {circ.subject}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                           <span className="md:hidden text-[10px] font-black text-indigo-600 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-md tracking-tighter uppercase italic">
                              {circ.siteId?.replace('Parekh', '')}
                           </span>
                           <span className="md:hidden text-[10px] font-black text-slate-500 px-2 py-0.5 bg-white border border-slate-200 rounded-md tracking-widest uppercase italic shadow-sm">
                              {circ.publishDate}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                             ID: CRC-{circ._id.slice(-6).toUpperCase()}
                           </span>
                        </div>
                      </div>
                      
                      {/* Mobile Actions - Visible only on mobile */}
                      <div className="flex md:hidden items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                        <a 
                          href={circ.pdfUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100"
                        >
                          <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                          View PDF
                        </a>
                        <button 
                          onClick={() => handleEditClick(circ)} 
                          className="p-2 bg-slate-50 text-emerald-600 rounded-xl border border-slate-200"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(circ._id)} 
                          className="p-2 bg-slate-50 text-rose-600 rounded-xl border border-slate-200"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-8 py-6">
                      <span className="text-[10px] font-black text-indigo-600 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-md tracking-tighter uppercase italic">
                        {circ.siteId?.replace('Parekh', '')}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-8 py-6">
                      <span className="text-[10px] font-black text-slate-500 px-3 py-1 bg-white border border-slate-200 rounded-md tracking-widest uppercase italic shadow-sm">
                        {circ.publishDate}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 transition-all">
                        <a 
                          href={circ.pdfUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all border border-slate-100 hover:border-indigo-100"
                          title="View PDF"
                        >
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        </a>
                        <button 
                          onClick={() => handleEditClick(circ)} 
                          className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-xl shadow-sm transition-all border border-slate-100 hover:border-emerald-100"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(circ._id)} 
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all border border-slate-100 hover:border-rose-100"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
          {/* Enhanced Backdrop */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-scale-in max-h-full">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                  {editingCircular ? 'Update Circular' : 'Add New Circular'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Broadcast Configuration</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2 tracking-tighter">Circular Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="clean-input font-bold text-slate-900 shadow-sm"
                  placeholder="Enter the subject of the circular..."
                  required
                />
              </div>

              {user.siteId === 'all' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2 tracking-tighter">Target Platform</label>
                  <div className="relative group">
                    <select
                      value={formData.siteId}
                      onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                      className="clean-input font-bold text-slate-900 pr-10 appearance-none shadow-sm"
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
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2 tracking-tighter">Upload PDF Document</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 10 * 1024 * 1024) {
                        alert("The selected PDF is too large. Please reduce its size below 10MB before uploading.");
                        e.target.value = ""; // Clear the input
                        return;
                      }
                      setFormData({ ...formData, pdf: file });
                    }}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label 
                    htmlFor="pdf-upload"
                    className="flex items-center gap-4 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-white transition-all group shadow-sm"
                  >
                    <div className="h-10 w-10 shrink-0 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all shadow-sm">
                      <CloudArrowUpIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">
                        {formData.pdf ? formData.pdf.name : editingCircular ? 'Change PDF Document' : 'Choose File'}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Max size: 10MB (PDF Only)</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2 tracking-tighter">Date of Published</label>
                <input
                  type="text"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  className="clean-input font-bold text-slate-900 shadow-sm"
                  placeholder="e.g. 28 April 2026"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 px-6 border border-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[1.5] py-4 px-6 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {editingCircular ? 'Update Broadcast' : 'Authorize Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Circulars;
