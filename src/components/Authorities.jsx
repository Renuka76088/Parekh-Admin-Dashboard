import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, KeyIcon } from '@heroicons/react/24/outline';
import { authorizedPersonApi } from '../utils/api';

const Authorities = () => {
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthority, setEditingAuthority] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });

  useEffect(() => {
    fetchAuthorities();
  }, []);

  const fetchAuthorities = async () => {
    try {
      setLoading(true);
      const response = await authorizedPersonApi.list();
      if (response.data.success) {
        setAuthorities(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching authorities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAuthority(null);
    setFormData({ name: '', code: '' });
    setShowModal(true);
  };

  const handleEdit = (authority) => {
    setEditingAuthority(authority);
    setFormData({ ...authority });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setAuthorities(authorities.filter(auth => auth.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAuthority) {
        // Edit not fully implemented in current backend controller, but placeholder
        alert("Edit functionality not yet implemented in backend.");
      } else {
        const response = await authorizedPersonApi.add(formData);
        if (response.data.success) {
          await fetchAuthorities();
          setShowModal(false);
        } else {
          alert(response.data.message || "Failed to add authority");
        }
      }
    } catch (error) {
      console.error("Error submitting authority:", error);
      alert(error.response?.data?.message || "Internal server error");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Authorities Management</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Authority
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 premium-shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Loading authorities...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-linear-to-r from-slate-100 to-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Access Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Added On</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {authorities.map((auth) => (
                <tr key={auth._id} className="hover:bg-linear-to-r hover:from-sky-50 hover:to-blue-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{auth.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="px-2 py-1 bg-slate-100 text-blue-600 rounded-md font-mono text-sm">{auth.code}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(auth.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(auth)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 mr-2"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(auth._id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-linear-to-r from-sky-600 to-blue-700 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">
                {editingAuthority ? 'Edit Authority' : 'Add Authority'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Access Code</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none pr-12"
                    placeholder="Create a unique access code"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <KeyIcon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">This code will be used by the person to authorize form submissions.</p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-medium text-white bg-linear-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {editingAuthority ? 'Update Authority' : 'Add Authority'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authorities;