import { useState, useEffect } from 'react';
import {
  PlusIcon, PencilIcon, TrashIcon, XMarkIcon,
  TagIcon, GlobeAltIcon, ChevronDownIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { categoryApi } from '../utils/api';

const Categories = () => {
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

  const [selectedWebsite, setSelectedWebsite] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', siteId: 'ParekheTradeMarket02' });
  const [errors, setErrors] = useState({ name: false, siteId: false });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.list(selectedWebsite === 'all' ? '' : selectedWebsite);
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Fetch Categories Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [selectedWebsite]);

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', siteId: selectedWebsite === 'all' ? 'ParekheTradeMarket02' : selectedWebsite });
    setErrors({ name: false, siteId: false });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ ...category });
    setErrors({ name: false, siteId: false });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Archive this category? Linked products will lose classification but remain in database.")) {
      try {
        await categoryApi.delete(id);
        fetchCategories();
      } catch (error) {
        alert("Operation blocked by server protocol.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Expert UI Validation
    const newErrors = {
      name: !formData.name,
      siteId: !formData.siteId
    };
    setErrors(newErrors);

    if (newErrors.name || newErrors.siteId) return;

    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory._id, formData);
      } else {
        await categoryApi.add(formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      alert("System integrity error: Submission failed.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Heading */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">System Taxonomy</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Project Classifications</h2>
          <p className="mt-1 text-slate-500 font-medium">Define and organize product categories across the ecosystem.</p>
        </div>

        <div className="flex items-center gap-4">
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
          <button onClick={handleAdd} className="premium-btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            New Category
          </button>
        </div>
      </div>

      {/* Main Grid View (More Expert / Professional than tables for simple items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-sm font-bold text-slate-500 mt-4">Analyzing Global Taxonomy...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="bg-slate-50 p-6 rounded-[2.5rem] inline-block border border-slate-100">
              <GlobeAltIcon className="w-10 h-10 text-slate-200" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mt-4 tracking-tight">Empty Classification View</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Refine filters or add entries</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="premium-card p-8 group">
              <div className="flex justify-between items-start mb-6">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <TagIcon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(cat)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h5 className="text-xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">{cat.name}</h5>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Target:</span>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">
                  {cat.siteId?.replace('Parekh', '') || 'Global'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Profile Creation */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-slate-200 animate-fade-in-up">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingCategory ? 'Edit Entry' : 'New Entry'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Taxonomy Record</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.name ? 'text-rose-500' : 'text-slate-500'}`}>
                    Category Name {errors.name && '— Required'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`clean-input font-bold text-slate-900 ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. Export Division"
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.siteId ? 'text-rose-500' : 'text-slate-500'}`}>
                    Host Site {errors.siteId && '— Selection Needed'}
                  </label>
                  <div className="relative group">
                    <select
                      value={formData.siteId}
                      onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                      className={`clean-input font-bold text-slate-900 pr-10 appearance-none ${errors.siteId ? 'error' : ''}`}
                    >
                      {websites.filter(s => s.id !== 'all').map((site) => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full premium-btn-primary py-5 text-lg shadow-xl shadow-indigo-100">
                  {editingCategory ? 'Update Classification' : 'Authorize Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;