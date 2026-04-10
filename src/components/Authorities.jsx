import { useState, useEffect } from 'react';
import { 
  PlusIcon, PencilIcon, TrashIcon, KeyIcon, 
  XMarkIcon, UserIcon, IdentificationIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { authorizedPersonApi } from '../utils/api';

const Authorities = () => {
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthority, setEditingAuthority] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [errors, setErrors] = useState({ name: false, code: false });

  const fetchAuthorities = async () => {
    try {
      setLoading(true);
      const res = await authorizedPersonApi.list();
      setAuthorities(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorities();
  }, []);

  const handleAdd = () => {
    setEditingAuthority(null);
    setFormData({ name: '', code: '' });
    setErrors({ name: false, code: false });
    setShowModal(true);
  };

  const handleEdit = (auth) => {
    setEditingAuthority(auth);
    setFormData({ name: auth.name, code: auth.code });
    setErrors({ name: false, code: false });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Revoke access for this personnel? This will immediately invalidate their security code.")) {
      try {
        await authorizedPersonApi.delete(id);
        fetchAuthorities();
      } catch (error) {
        alert("Operation denied: Database constraint.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Expert Validation
    const newErrors = {
      name: !formData.name,
      code: !formData.code || formData.code.length < 4
    };
    setErrors(newErrors);

    if (newErrors.name || newErrors.code) return;

    try {
      if (editingAuthority) {
        await authorizedPersonApi.update(editingAuthority._id, formData);
      } else {
        await authorizedPersonApi.add(formData);
      }
      setShowModal(false);
      fetchAuthorities();
    } catch (error) {
      alert("Conflict: Security code may already be in use by another person.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Security & Access</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Authorized Personnel</h2>
          <p className="mt-1 text-slate-500 font-medium">Manage security codes and identity records for privileged access.</p>
        </div>

        <button onClick={handleAdd} className="premium-btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Provision Personnel
        </button>
      </div>

      {/* Grid Layout (Expert Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
             <div className="col-span-full py-24 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                <p className="text-sm font-bold text-slate-500 mt-4">Consulting Security Protocol...</p>
            </div>
        ) : authorities.length === 0 ? (
            <div className="col-span-full py-20 text-center">
                <div className="bg-slate-50 p-6 rounded-[2.5rem] inline-block border border-slate-100">
                    <IdentificationIcon className="w-10 h-10 text-slate-200" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mt-4 tracking-tight">Zero Personnel Records</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">No authorization profiles exist yet.</p>
            </div>
        ) : (
            authorities.map((auth) => (
                <div key={auth._id} className="premium-card p-8 group relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                         <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <UserIcon className="h-6 w-6" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(auth)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                <PencilIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(auth._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    <h5 className="text-lg font-black text-slate-900 tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">
                        {auth.name}
                    </h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Personnel ID: {auth._id.slice(-6).toUpperCase()}</p>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2">
                            <KeyIcon className="h-4 w-4 text-indigo-500" />
                            <span className="text-xs font-black text-slate-900 tracking-widest">****</span>
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase italic opacity-50">Active Code</span>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Security Provisioning Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-slate-200 animate-fade-in-up">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {editingAuthority ? 'Update Security' : 'New Security Init'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Authorized Person Profile</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.name ? 'text-rose-500' : 'text-slate-500'}`}>
                        Personnel Legal Name {errors.name && '— Required'}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`clean-input font-bold text-slate-900 ${errors.name ? 'error' : ''}`}
                      placeholder="e.g. Rahul Sharma"
                    />
                </div>

                <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.code ? 'text-rose-500' : 'text-slate-500'}`}>
                        Access Code {errors.code && '— Min 4 Chars Needed'}
                    </label>
                    <div className="relative">
                        <input
                          type="password"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          className={`clean-input font-bold text-slate-900 pr-12 tracking-widest ${errors.code ? 'error' : ''}`}
                          placeholder="Unique ID"
                        />
                        <KeyIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full premium-btn-primary py-5 text-lg shadow-xl shadow-indigo-100">
                  {editingAuthority ? 'Override Security' : 'Authorize Credentials'}
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