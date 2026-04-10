import { useState, useEffect, useMemo } from 'react';
import { PlusIcon, TrashIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { productApi, categoryApi } from '../utils/api';

const Products = () => {
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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', siteId: 'ParekhETradeMarket02' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      // If we are adding a product and the site has categories, default to the first one
      if (res.data.data?.length > 0 && !formData.category) {
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
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setFormData({ title: '', category: '', siteId: selectedWebsite === 'all' ? 'ParekhETradeMarket02' : selectedWebsite });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.delete(id);
        fetchProducts();
      } catch (error) {
        alert("Failed to delete product.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select a product image.");

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('siteId', formData.siteId);
    data.append('image', imageFile);

    try {
      await productApi.add(data);
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert("Failed to add product.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Product Management</h2>
          <p className="mt-1 text-slate-600">Add and manage products for each site.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="inline-flex flex-col text-sm text-slate-700">
            <span className="mb-2 font-semibold">Filter by Website</span>
            <select
              value={selectedWebsite}
              onChange={(e) => setSelectedWebsite(e.target.value)}
              className="min-w-[240px] px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 shadow-sm"
            >
              {websites.map((site) => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </label>

          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200/50 hover:bg-sky-700 transition-all duration-200 mt-auto"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Image</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Site ID</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-sm text-slate-400 font-medium">
                    No products found. Start by adding one.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <img 
                        src={`http://localhost:5000/${prod.image}`} 
                        alt={prod.title} 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-slate-900">{prod.title}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-600">{prod.category}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold text-sky-700 border border-sky-100 uppercase tracking-tight">
                        {prod.siteId}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="text-rose-500 hover:text-rose-700 bg-rose-50 p-2 rounded-lg transition-colors"
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
          <div className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-slate-200">
            <div className="bg-sky-600 px-6 py-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Add New Product</h3>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-6 hover:border-sky-400 transition-colors bg-slate-50 group">
                  {imagePreview ? (
                    <div className="relative w-full aspect-video">
                      <img src={imagePreview} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                      <button 
                        type="button" 
                        onClick={() => {setImageFile(null); setImagePreview(null);}}
                        className="absolute top-2 right-2 bg-white/90 p-1 rounded-full shadow-lg"
                      >
                        <XMarkIcon className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer py-4">
                      <PhotoIcon className="w-12 h-12 text-slate-300 mb-2 group-hover:text-sky-500 transition-colors" />
                      <span className="text-sm font-bold text-slate-500">Click to upload product image</span>
                      <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                    </label>
                  )}
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                      placeholder="e.g. Organic Long-Staple Cotton"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium"
                      required
                    >
                      <option value="">Select a Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="mt-1 text-[10px] text-rose-500 font-bold">No categories found for this site. Add one in Categories first.</p>
                    )}
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
              </div>

              <button
                type="submit"
                disabled={categories.length === 0}
                className={`w-full rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-xl transition-all transform active:scale-95 ${
                  categories.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-sky-600 shadow-sky-200 hover:bg-sky-700'
                }`}
              >
                Upload and Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

