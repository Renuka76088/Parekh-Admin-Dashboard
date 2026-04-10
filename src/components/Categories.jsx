import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { categoryApi } from '../utils/api';

const Categories = () => {
  const websites = [
    { id: 'all', name: 'All Websites' },
    { id: 'ParekhChamberofTextile01', name: 'Parekh Chamber of Textile' },
    { id: 'ParekhETradeMarket02', name: 'Parekh e-Trade Market' },
    { id: 'ParekhSouthernPolyfabrics03', name: 'Parekh Southern Polyfabrics' },
    { id: 'ParekhLinen04', name: 'Parekh Linen' },
    { id: 'ParekhRayon05', name: 'Parekh Rayon' },
    { id: 'ParekhFabrics06', name: 'Parekh Fabrics' },
    { id: 'ParekhSilk07', name: 'Parekh Silk' },
  ];

  const [selectedWebsite, setSelectedWebsite] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', siteId: 'ParekhETradeMarket02' });

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
    setFormData({ name: '', siteId: selectedWebsite === 'all' ? 'ParekhETradeMarket02' : selectedWebsite });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ ...category });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will not delete products, but they will no longer have a linked category.")) {
      try {
        await categoryApi.delete(id);
        fetchCategories();
      } catch (error) {
        alert("Failed to delete category.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory._id, formData);
      } else {
        await categoryApi.add(formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Category Management</h2>
          <p className="mt-1 text-slate-600">Create global or site-specific categories for your products.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="inline-flex flex-col text-sm text-slate-700">
            <span className="mb-2 font-semibold text-xs uppercase tracking-wider text-slate-500">Filter by Website</span>
            <select
              value={selectedWebsite}
              onChange={(e) => setSelectedWebsite(e.target.value)}
              className="min-w-[240px] px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-sky-500/20 transition-all shadow-sm outline-none"
            >
              {websites.map((site) => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </label>

          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700 transition-all mt-auto"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 italic">Category Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 italic">Associated Site</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 italic">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400">Loading Categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <GlobeAltIcon className="w-12 h-12 text-slate-200 mb-2" />
                      <p className="text-slate-400 font-medium">No Categories Found for this site.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{cat.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 border border-sky-100 uppercase tracking-tighter">
                        {cat.siteId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-sky-600 hover:text-sky-900 p-2 rounded-lg bg-sky-50 transition-colors"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="text-rose-500 hover:text-rose-900 p-2 rounded-lg bg-rose-50 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-slate-200">
            <div className="bg-sky-600 px-6 py-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                    placeholder="e.g. Raw Materials"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Website</label>
                  <select
                    value={formData.siteId}
                    onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium"
                    required
                  >
                    {websites.filter(s => s.id !== 'all').map((site) => (
                      <option key={site.id} value={site.id}>{site.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-sky-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-sky-200 hover:bg-sky-700 transition-all transform active:scale-95"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;