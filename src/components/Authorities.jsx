import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  PlusIcon, PencilIcon, TrashIcon, KeyIcon, 
  XMarkIcon, UserIcon, IdentificationIcon,
  ExclamationCircleIcon, EyeIcon, EyeSlashIcon
} from '@heroicons/react/24/outline';
import { authorizedPersonApi } from '../utils/api';

const Authorities = () => {
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthority, setEditingAuthority] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [errors, setErrors] = useState({ name: false, code: false });
  const [visibleCodes, setVisibleCodes] = useState({});
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openAddModal) {
      handleAdd();
    }
  }, [location.state]);

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
    setShowPasswordInModal(false);
    setShowModal(true);
  };

  const handleEdit = (auth) => {
    setEditingAuthority(auth);
    setFormData({ name: auth.name, code: auth.code });
    setErrors({ name: false, code: false });
    setShowPasswordInModal(false);
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

  const toggleCodeVisibility = (id) => {
    setVisibleCodes(prev => ({ ...prev, [id]: !prev[id] }));
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
    <>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
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
              <div key={auth._id} className="premium-card p-8 group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50">
                <div className="flex justify-between items-start mb-8">
                  <div className="h-14 w-14 flex items-center justify-center rounded-[1.25rem] bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <UserIcon className="h-7 w-7" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button 
                      onClick={() => handleEdit(auth)} 
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all"
                      title="Edit Profile"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(auth._id)} 
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:shadow-lg transition-all"
                      title="Revoke Access"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1 mb-8">
                  <h5 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {auth.name}
                  </h5>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Personnel ID</span>
                    <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded shadow-sm italic uppercase tracking-tighter">
                      #{auth._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-600/5 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl transition-all duration-300 group-hover:bg-white group-hover:border-indigo-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-100/50 flex items-center justify-center text-indigo-600">
                        <KeyIcon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Security Code</span>
                        <span className={`text-sm font-black text-slate-900 tracking-[0.3em] font-mono ${visibleCodes[auth._id] ? '' : 'blur-[2px]'}`}>
                          {visibleCodes[auth._id] ? auth.code : '••••'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleCodeVisibility(auth._id)} 
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95 shadow-sm"
                      title={visibleCodes[auth._id] ? "Hide Code" : "View Code"}
                    >
                      {visibleCodes[auth._id] ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Security Provisioning Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
          {/* Enhanced Backdrop */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)} />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-scale-in max-h-full">
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
                    <div className="relative group">
                        <input
                          type={showPasswordInModal ? 'text' : 'password'}
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          className={`clean-input font-bold text-slate-900 pr-12 tracking-widest shadow-sm ${errors.code ? 'error' : ''}`}
                          placeholder="Unique ID"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-indigo-600 hover:bg-slate-50 transition-all"
                        >
                          {showPasswordInModal ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
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
    </>
  );
};

export default Authorities;