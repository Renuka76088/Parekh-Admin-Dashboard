import { useState, useEffect, useMemo } from 'react';
import {
  PlusIcon, TrashIcon, PhotoIcon, XMarkIcon, PencilIcon,
  TagIcon, MagnifyingGlassIcon, ExclamationTriangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { productApi, categoryApi } from '../utils/api';

const Products = () => {
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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', siteId: 'ParekheTradeMarket02' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({ title: false, category: false, siteId: false });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.list(selectedWebsite === 'all' ? '' : selectedWebsite);
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Fetch Products Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesForSite = async (siteId) => {
    try {
      const res = await categoryApi.list(siteId);
      setCategories(res.data.data || []);
      if (!editingProduct && res.data.data?.length > 0) {
        setFormData(prev => ({ ...prev, category: res.data.data[0].name }));
      }
    } catch (error) {
      console.error("Fetch Categories Error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedWebsite]);

  useEffect(() => {
    if (showModal) {
      fetchCategoriesForSite(formData.siteId);
    }
  }, [showModal, formData.siteId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ title: '', category: '', siteId: 'ParekheTradeMarket02' });
    setImageFile(null);
    setImagePreview(null);
    setErrors({ title: false, category: false, siteId: false });
    setShowModal(true);
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({ title: prod.title, category: prod.category, siteId: prod.siteId });
    setImageFile(null);
    setImagePreview(`http://localhost:5000/${prod.image}`);
    setErrors({ title: false, category: false, siteId: false });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanent removal of this product? Information cannot be recovered.")) {
      try {
        await productApi.delete(id);
        fetchProducts();
      } catch (error) {
        alert("Operation aborted. Check server logs.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation with visual feedback (Expert UI Requirement)
    const newErrors = {
      title: !formData.title,
      category: !formData.category,
      siteId: !formData.siteId
    };
    setErrors(newErrors);

    if (newErrors.title || newErrors.category || newErrors.siteId) {
      return; // Stop and show error states
    }

    if (!editingProduct && !imageFile) {
      alert("Hero image is mandatory for new project profile.");
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('siteId', formData.siteId);
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingProduct) {
        await productApi.update(editingProduct._id, data);
      } else {
        await productApi.add(data);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert(`System fault: ${editingProduct ? 'update' : 'entry'} failed.`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Heading Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Inventory Management</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Products & Services</h2>
          <p className="mt-1 text-slate-500 font-medium">Coordinate the display profiles and service listings across platforms.</p>
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
          <button
            onClick={handleAdd}
            className="premium-btn-primary gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Enroll New Product
          </button>
        </div>
      </div>

      {/* Stats Quick Links (Clean & Professional) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-indigo-200 transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Listings</p>
          <h4 className="text-2xl font-black text-slate-900">{products.length}</h4>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-indigo-200 transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Categories</p>
          <h4 className="text-2xl font-black text-slate-900">{[...new Set(products.map(p => p.category))].length}</h4>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Title</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Origin</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="text-sm font-bold text-slate-500 mt-4">Synchronizing Global Inventory...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center text-slate-400 font-bold italic">
                    Catalog search returned no matching results.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                        <img
                          src={`http://localhost:5000/${prod.image}`}
                          alt={prod.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{prod.title}</span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
                        <span className="text-xs font-bold text-slate-700">{prod.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className="text-[10px] font-black text-slate-500 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md tracking-tighter uppercase italic">
                        {prod.siteId?.replace('Parekh', '') || 'Global'}
                      </span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(prod)}
                          className="p-2.5 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm border border-indigo-50"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="p-2.5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm border border-rose-50"
                        >
                          <TrashIcon className="w-5 h-5" />
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

      {/* Modal Profile Creation */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-slate-200 animate-fade-in-up">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingProduct ? 'Update Asset' : 'Enroll Asset'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Configuration Profile</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                {/* Image Upload Pattern */}
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] p-4 group transition-colors hover:border-indigo-400 bg-slate-50">
                  {imagePreview ? (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg">
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-xl text-rose-500 shadow-xl"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer py-10 w-full">
                      <div className="h-16 w-16 bg-white border border-slate-200 rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <PhotoIcon className="w-8 h-8" />
                      </div>
                      <span className="text-sm font-black text-slate-700">Drop Profile Image Here</span>
                      <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">JPG, PNG or WEBP (Standard Aspect Ratio)</p>
                      <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.title ? 'text-rose-500' : 'text-slate-500'}`}>
                      Product Title {errors.title && '— Required Field'}
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`clean-input font-bold text-slate-900 ${errors.title ? 'error' : ''}`}
                      placeholder="Identify this listing..."
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.category ? 'text-rose-500' : 'text-slate-500'}`}>
                      Classification {errors.category && '— Required'}
                    </label>
                    <div className="relative group">
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={`clean-input font-bold text-slate-900 pr-10 appearance-none ${errors.category ? 'error' : ''}`}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                    </div>
                    {categories.length === 0 && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                        <ExclamationTriangleIcon className="h-4 w-4 text-amber-500 shrink-0" />
                        <p className="text-[10px] font-bold text-amber-700 leading-tight">No classifications found for this platform. Sync required.</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.siteId ? 'text-rose-500' : 'text-slate-500'}`}>
                      Target Platform {errors.siteId && '— Selection Needed'}
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
              </div>

              <div className="pt-4 pb-2">
                <button
                  type="submit"
                  disabled={categories.length === 0}
                  className="w-full premium-btn-primary py-5 text-lg shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:grayscale"
                >
                  {editingProduct ? 'Authorize Update' : 'Finalize Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
