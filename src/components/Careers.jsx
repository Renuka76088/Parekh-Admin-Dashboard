import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Careers = () => {
  const [openings, setOpenings] = useState([
    { id: 1, title: 'Software Engineer', department: 'IT', location: 'Remote', status: 'Open' },
    { id: 2, title: 'Marketing Manager', department: 'Marketing', location: 'On-site', status: 'Open' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingOpening, setEditingOpening] = useState(null);
  const [formData, setFormData] = useState({ title: '', department: '', location: '', status: 'Open' });

  const handleAdd = () => {
    setEditingOpening(null);
    setFormData({ title: '', department: '', location: '', status: 'Open' });
    setShowModal(true);
  };

  const handleEdit = (opening) => {
    setEditingOpening(opening);
    setFormData({ ...opening });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setOpenings(openings.filter(open => open.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOpening) {
      setOpenings(openings.map(open => open.id === editingOpening.id ? { ...formData, id: editingOpening.id } : open));
    } else {
      setOpenings([...openings, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleEmail = (opening) => {
    // Mock email functionality
    alert(`Career opening "${opening.title}" details sent via email`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Career Openings</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Opening
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {openings.map((open) => (
              <tr key={open.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{open.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{open.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{open.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    open.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {open.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEmail(open)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <EnvelopeIcon className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => handleEdit(open)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(open.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-linear-to-r from-orange-600 to-red-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">
                {editingOpening ? 'Edit Opening' : 'Add Opening'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 outline-none"
                  placeholder="Enter job title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 outline-none"
                  placeholder="Enter department"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 outline-none"
                  placeholder="Enter location"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 outline-none"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
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
                  className="px-6 py-3 text-sm font-medium text-white bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {editingOpening ? 'Update Opening' : 'Add Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;