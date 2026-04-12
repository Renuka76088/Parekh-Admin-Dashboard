import { useState, useEffect } from 'react';
import {
  PlusIcon, PencilIcon, TrashIcon, XMarkIcon,
  MapPinIcon, BriefcaseIcon, CurrencyDollarIcon,
  EnvelopeIcon, ChevronDownIcon, GlobeAltIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { careerApi } from '../utils/api';

const Careers = () => {
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
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [formData, setFormData] = useState({
    title: '', location: '', salary: '',
    description: '', requirements: '',
    siteId: 'ParekheTradeMarket02', contactEmail: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const res = await careerApi.list(selectedWebsite === 'all' ? '' : selectedWebsite);
      setCareers(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, [selectedWebsite]);

  const handleAdd = () => {
    setEditingCareer(null);
    setFormData({
      title: '', location: '', salary: '',
      description: '', requirements: '',
      siteId: 'ParekheTradeMarket02', contactEmail: '',
      status: 'active'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (career) => {
    setEditingCareer(career);
    setFormData({ ...career });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Archive this vacancy? Applicants will no longer be able to submit profiles.")) {
      try {
        await careerApi.delete(id);
        fetchCareers();
      } catch (error) {
        alert("Operation denied: Database protocol violation.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Expert Validation Logic
    const newErrors = {
      title: !formData.title,
      location: !formData.location,
      siteId: !formData.siteId,
      contactEmail: !formData.contactEmail || !formData.contactEmail.includes('@')
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(v => v)) return;

    try {
      if (editingCareer) {
        await careerApi.update(editingCareer._id, formData);
      } else {
        await careerApi.add(formData);
      }
      setShowModal(false);
      fetchCareers();
    } catch (error) {
      alert("System integrity fault: Career provisioning failed.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Human Capital</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Talent Acquisition</h2>
          <p className="mt-1 text-slate-500 font-medium">Engineer and manage recruitment opportunities across the ecosystem.</p>
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
            Post Vacancy
          </button>
        </div>
      </div>

      {/* Career Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-sm font-bold text-slate-500 mt-4">Consulting Personnel Database...</p>
          </div>
        ) : careers.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="bg-slate-50 p-6 rounded-[2.5rem] inline-block border border-slate-100">
              <BriefcaseIcon className="w-10 h-10 text-slate-200" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mt-4 tracking-tight">Zero Vacancy Profiles</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ready to hire? Create a new listing.</p>
          </div>
        ) : (
          careers.map((job) => (
            <div key={job._id} className="premium-card p-10 group relative transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 flex flex-col h-full bg-gradient-to-br from-white to-slate-50/30">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest mb-2 block w-fit">
                    {job.siteId?.replace('Parekh', '') || 'Corporate'}
                  </span>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
                    {job.title}
                  </h4>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(job)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(job._id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 flex-1">
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl border border-slate-100 group-hover:border-indigo-100 transition-colors shadow-sm">
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <MapPinIcon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">{job.location}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl border border-slate-100 group-hover:border-indigo-100 transition-colors shadow-sm">
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <CurrencyDollarIcon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">{job.salary || 'Competitive'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-100/60">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200/50 shadow-inner">
                  <EnvelopeIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{job.contactEmail || job.email}</span>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${job.status === 'active' || job.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                  {job.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Provisioning Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-slate-200 animate-fade-in-up">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingCareer ? 'Refine Vacancy' : 'New Vacancy Init'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Opportunity Architecture</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.title ? 'text-rose-500' : 'text-slate-500'}`}>
                    Position Title {errors.title && '— Required'}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`clean-input font-bold text-slate-900 ${errors.title ? 'error' : ''}`}
                    placeholder="e.g. Senior Textile Engineer"
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.location ? 'text-rose-500' : 'text-slate-500'}`}>
                    Operation Hub {errors.location && '— Required'}
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={`clean-input font-bold text-slate-900 pl-11 ${errors.location ? 'error' : ''}`}
                      placeholder="Surat, Gujarat"
                    />
                    <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Salary Band (Optional)</label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="clean-input font-bold text-slate-900 pl-11"
                      placeholder="e.g. 5L - 8L PA"
                    />
                    <CurrencyDollarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.contactEmail ? 'text-rose-500' : 'text-slate-500'}`}>
                    Acquisition Email {errors.contactEmail && '— Valid Email Required'}
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className={`clean-input font-bold text-slate-900 pl-11 ${errors.contactEmail ? 'error' : ''}`}
                      placeholder="hr@parekh.com"
                    />
                    <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Target Platform</label>
                  <div className="relative group">
                    <select
                      value={formData.siteId}
                      onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                      className="clean-input pr-10 appearance-none font-bold text-slate-900 shadow-sm"
                    >
                      {websites.filter(s => s.id !== 'all').map((site) => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Technical Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="clean-input h-32 resize-none leading-relaxed font-medium"
                    placeholder="Primary responsibilities and role context..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Minimum Requirements</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="clean-input h-32 resize-none leading-relaxed font-medium"
                    placeholder="Key qualifications and skills..."
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full premium-btn-primary py-5 text-lg shadow-xl shadow-indigo-100">
                  {editingCareer ? 'Authorize Vacancy Update' : 'Command Opportunity Post'}
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