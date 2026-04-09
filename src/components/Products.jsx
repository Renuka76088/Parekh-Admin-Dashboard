import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Products = () => {
  const websites = ['All Websites', 'E Trade', 'Linen', 'PolyFabric'];
  const [selectedWebsite, setSelectedWebsite] = useState('E Trade');
  const [products, setProducts] = useState([
    { id: 1, name: 'Product A', category: 'Electronics', price: 100, status: 'Active', website: 'E Trade' },
    { id: 2, name: 'Service B', category: 'Consulting', price: 200, status: 'Active', website: 'Linen' },
    { id: 3, name: 'Product C', category: 'Software', price: 150, status: 'Inactive', website: 'PolyFabric' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', website: 'E Trade', status: 'Active' });

  const filteredProducts = selectedWebsite === 'All Websites'
    ? products
    : products.filter(prod => prod.website === selectedWebsite);

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: '', website: selectedWebsite === 'All Websites' ? 'E Trade' : selectedWebsite, status: 'Active' });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(prod => prod.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(prod => prod.id === editingProduct.id ? { ...formData, id: editingProduct.id } : prod));
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Products & Services</h2>
          <p className="mt-1 text-sm text-slate-600">Select the website and manage products for that environment.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="inline-flex flex-col text-sm text-slate-700">
            <span className="mb-2 font-medium">Website</span>
            <select
              value={selectedWebsite}
              onChange={(e) => setSelectedWebsite(e.target.value)}
              className="min-w-[200px] px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
            >
              {websites.map((site) => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
          </label>

          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/50 hover:bg-sky-700 transition-all duration-200"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Product/Service
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 bg-white">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Website</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-500">
                  No products found for the selected website.
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{prod.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{prod.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{prod.website}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">${prod.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      prod.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="text-sky-600 hover:text-sky-800 mr-3"
                    >
                      <PencilIcon className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="text-rose-600 hover:text-rose-800"
                    >
                      <TrashIcon className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="bg-linear-to-r from-sky-600 to-blue-700 px-6 py-5">
              <h3 className="text-xl font-semibold text-white">
                {editingProduct ? 'Edit Product/Service' : `Add Product for ${selectedWebsite}`}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                <select
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                  required
                >
                  {websites.filter(site => site !== 'All Websites').map((site) => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                  placeholder="Enter product/service name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                  placeholder="Enter category"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/40 hover:bg-sky-700 transition-all duration-200"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
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
