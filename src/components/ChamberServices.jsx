import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Briefcase, Sparkles, Scale, Globe, Users, Lightbulb, Factory, FileText, 
  ShieldCheck, Presentation, Handshake, Cpu, FlaskConical, 
  Banknote, GraduationCap, Rocket, Puzzle, Layers, Wrench, ShoppingBag, Settings,
  Plus, Pencil, Trash2, X
} from 'lucide-react';
import { chamberServiceApi } from '../utils/api';

const ChamberServices = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('hc_admin_user') || '{}'));
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ title: '', icon: 'BriefcaseIcon' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const icons = [
    { name: 'BriefcaseIcon', icon: Briefcase },
    { name: 'SparklesIcon', icon: Sparkles },
    { name: 'ScaleIcon', icon: Scale },
    { name: 'GlobeAltIcon', icon: Globe },
    { name: 'UserGroupIcon', icon: Users },
    { name: 'LightBulbIcon', icon: Lightbulb },
    { name: 'BuildingOfficeIcon', icon: Factory },
    { name: 'DocumentTextIcon', icon: FileText },
    { name: 'ShieldCheckIcon', icon: ShieldCheck },
    { name: 'PresentationChartLineIcon', icon: Presentation },
    { name: 'HandThumbUpIcon', icon: Handshake },
    { name: 'CpuChipIcon', icon: Cpu },
    { name: 'BeakerIcon', icon: FlaskConical },
    { name: 'CurrencyDollarIcon', icon: Banknote },
    { name: 'AcademicCapIcon', icon: GraduationCap },
    { name: 'RocketLaunchIcon', icon: Rocket },
    { name: 'PuzzlePieceIcon', icon: Puzzle },
    { name: 'Square3Stack3DIcon', icon: Layers },
    { name: 'WrenchScrewdriverIcon', icon: Wrench },
    { name: 'ShoppingBagIcon', icon: ShoppingBag },
    { name: 'Cog6ToothIcon', icon: Settings },
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await chamberServiceApi.list('ParekhChamberofTextile01');
      setServices(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = () => {
    setEditingService(null);
    setFormData({ title: '', icon: 'BriefcaseIcon' });
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({ title: service.title, icon: service.icon });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this service?")) {
      try {
        await chamberServiceApi.delete(id);
        fetchServices();
      } catch (error) {
        alert("Deletion failed.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.icon) return;

    try {
      setIsSubmitting(true);
      if (editingService) {
        await chamberServiceApi.update(editingService._id, formData);
      } else {
        await chamberServiceApi.add({ ...formData, siteId: 'ParekhChamberofTextile01' });
      }
      setShowModal(false);
      fetchServices();
    } catch (error) {
      alert("Save failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconComponent = (iconName) => {
    const iconObj = icons.find(i => i.name === iconName);
    return iconObj ? iconObj.icon : Briefcase;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Site Specific</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Chamber Services</h2>
          <p className="mt-1 text-slate-500 font-medium">Manage core services displayed on the Chamber portal.</p>
        </div>
        <button onClick={handleAdd} className="premium-btn-primary gap-2">
          <Plus className="h-5 w-5" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full py-20 text-center premium-card border-dashed">
            <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h4 className="text-lg font-black text-slate-900 tracking-tight">No Services Defined</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Add your first chamber service</p>
          </div>
        ) : (
          services.map((service) => {
            const Icon = getIconComponent(service.icon);
            return (
              <div key={service._id} className="premium-card p-8 group transition-all duration-300 hover:shadow-2xl flex flex-col h-full bg-white relative">
                 <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
                        <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleEdit(service)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors">
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(service._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition-colors">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                 </div>
                 <h4 className="text-xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-orange-600 transition-colors">
                    {service.title}
                 </h4>
                 <div className="mt-6 pt-6 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Card Display Format
                 </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
          {/* Enhanced Backdrop */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-scale-in max-h-full">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingService ? 'Edit Service' : 'New Chamber Service'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Icon & Title Configuration</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Service Title</label>
                <textarea
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="clean-input font-bold text-slate-900 py-4 resize-none h-24"
                  placeholder="e.g. Textile Trade Support to our valued Members"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-4">Select Representational Icon</label>
                <div className="grid grid-cols-5 gap-4">
                  {icons.map((item) => {
                    const Icon = item.icon;
                    const isActive = formData.icon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.name })}
                        className={`h-16 flex items-center justify-center rounded-2xl border-2 transition-all ${
                          isActive 
                            ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-inner' 
                            : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full premium-btn-primary py-5 text-lg shadow-xl shadow-indigo-100 disabled:opacity-70"
              >
                {isSubmitting ? 'Processing...' : editingService ? 'Update Service' : 'Confirm Service Addition'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ChamberServices;
