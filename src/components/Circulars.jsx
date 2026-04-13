import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ChevronDownIcon, DocumentIcon } from '@heroicons/react/24/outline';

const Circulars = () => {
  const [circulars, setCirculars] = useState([
    { id: 1, title: 'Company Policy Update', content: 'New policies effective from next month...', date: '2023-10-01', status: 'Published' },
    { id: 2, title: 'Holiday Schedule', content: 'Upcoming holidays...', date: '2023-10-02', status: 'Draft' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingCircular, setEditingCircular] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', date: '', status: 'Draft' });

  const handleAdd = () => {
    setEditingCircular(null);
    setFormData({ title: '', content: '', date: '', status: 'Draft' });
    setShowModal(true);
  };

  const handleEdit = (circular) => {
    setEditingCircular(circular);
    setFormData({ ...circular });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setCirculars(circulars.filter(circ => circ.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCircular) {
      setCirculars(circulars.map(circ => circ.id === editingCircular.id ? { ...formData, id: editingCircular.id } : circ));
    } else {
      setCirculars([...circulars, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Internal Communications</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Official Circulars</h2>
            <p className="mt-1 text-slate-500 font-medium">Broadcast announcements and policy updates to the ecosystem.</p>
          </div>

          <button onClick={handleAdd} className="premium-btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Circular
          </button>
        </div>

        {/* Global Circulars Table */}
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Circular Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Content Overview</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Release Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {circulars.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center">
                        <div className="bg-slate-50 p-6 rounded-full border border-slate-100 mb-4">
                          <DocumentIcon className="h-10 w-10 text-slate-200" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">No Circulars Published</h4>
                        <p className="text-sm text-slate-400 font-medium mt-1">Broadcast important updates to your ecosystem.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  circulars.map((circ) => (
                    <tr key={circ.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase leading-tight">{circ.title}</span>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest opacity-60">ID: CRC-{String(circ.id).padStart(4, '0')}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-bold text-slate-500 truncate max-w-xs">{circ.content}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-slate-500 px-2 py-1 bg-white border border-slate-200 rounded-md tracking-tighter uppercase italic shadow-sm">
                          {circ.date}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border shadow-sm ${circ.status === 'Published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                          {circ.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => handleEdit(circ)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(circ.id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100">
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
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
          {/* Enhanced Backdrop */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)} />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-scale-in max-h-full">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingCircular ? 'Update Directive' : 'New Directive'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Circular Configuration</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Notice Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="clean-input font-bold text-slate-900 shadow-sm"
                    placeholder="Identify this directive..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Broadcast Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="clean-input h-48 resize-none leading-relaxed font-medium bg-slate-50 border-slate-100"
                    placeholder="Enter the full content of the circular..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Release Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="clean-input font-bold text-slate-900 shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Publishing Status</label>
                    <div className="relative group">
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="clean-input font-bold text-slate-900 pr-10 appearance-none shadow-sm"
                      >
                        <option value="Draft">Draft Mode</option>
                        <option value="Published">Immediate Release</option>
                      </select>
                      <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 pb-2">
                <button type="submit" className="w-full premium-btn-primary py-5 text-lg shadow-xl shadow-indigo-100">
                  {editingCircular ? 'Authorize Directive Update' : 'Initialize Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Circulars;