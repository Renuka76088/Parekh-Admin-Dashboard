import { useState, useEffect } from 'react';
import {
  PlusIcon, PencilIcon, TrashIcon, PhotoIcon, XMarkIcon,
  TagIcon, CalendarIcon, ChevronDownIcon,
  TicketIcon, TrophyIcon
} from '@heroicons/react/24/outline';
import { mediaEventApi } from '../utils/api';

const MediaEvents = () => {
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

  const categories = ['Award', 'Exhibition', 'News', 'Event', 'Other'];

  const [selectedWebsite, setSelectedWebsite] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'Event', date: '', siteId: 'ParekheTradeMarket02' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await mediaEventApi.list(selectedWebsite === 'all' ? '' : selectedWebsite);
      setEvents(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedWebsite]);

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
    setEditingEvent(null);
    setFormData({ title: '', category: 'Event', date: '', siteId: 'ParekheTradeMarket02' });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      category: event.category,
      date: event.date ? event.date.split('T')[0] : '',
      siteId: event.siteId
    });
    setImageFile(null);
    setImagePreview(`http://localhost:5000/${event.image}`);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanent erasure of this media archive? Data cannot be restored.")) {
      try {
        await mediaEventApi.delete(id);
        fetchEvents();
      } catch (error) {
        alert("Operation denied: Server protocol fault.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Expert Validation
    const newErrors = {
      title: !formData.title,
      category: !formData.category,
      date: !formData.date,
      siteId: !formData.siteId
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(v => v)) return;

    if (!editingEvent && !imageFile) {
      alert("High-Resolution Asset is mandatory for event profiles.");
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('date', formData.date);
    data.append('siteId', formData.siteId);
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingEvent) {
        await mediaEventApi.update(editingEvent._id, data);
      } else {
        await mediaEventApi.add(data);
      }
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      alert("Integrity Fault: Upload or data submission failed.");
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Brand Assets</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Media & Events</h2>
            <p className="mt-1 text-slate-500 font-medium">Coordinate press coverage, awards, and industry exhibitions across the ecosystem.</p>
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
              Archive Event
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="text-sm font-bold text-slate-500 mt-4">Consulting Media Archives...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="bg-slate-50 p-6 rounded-[2.5rem] inline-block border border-slate-100">
                <TrophyIcon className="w-10 h-10 text-slate-200" />
              </div>
              <h4 className="text-lg font-black text-slate-900 mt-4 tracking-tight">Archive Data Empty</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">No awards or events currently cataloged.</p>
            </div>
          ) : (
            events.map((ev) => (
              <div key={ev._id} className="premium-card overflow-hidden group flex flex-col hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
                <div className="aspect-video bg-slate-100 overflow-hidden relative">
                  <img
                    src={`https://api.parekhchamber.com/${ev.image}`}
                    alt={ev.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest bg-white/90 backdrop-blur-md text-indigo-700 border border-indigo-100 shadow-sm">
                      {ev.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={() => handleEdit(ev)} className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl hover:scale-110 transition-transform">
                      <PencilIcon className="h-6 w-6" />
                    </button>
                    <button onClick={() => handleDelete(ev._id)} className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-xl hover:scale-110 transition-transform">
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="p-8 pb-10">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">{ev.siteId?.replace('Parekh', '')}</span>
                  <h5 className="text-xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight">
                    {ev.title}
                  </h5>
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                    <CalendarIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                      {ev.date ? new Date(ev.date).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' }) : 'Date N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
          {/* Enhanced Backdrop */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)} />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-scale-in max-h-full">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingEvent ? 'Refine Profile' : 'Catalog Event'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Media Event Configuration</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="space-y-8">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] p-4 bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer group">
                  {imagePreview ? (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg">
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-4 right-4 bg-white/90 p-2 rounded-xl text-rose-500 shadow-xl"><XMarkIcon className="w-5 h-5" /></button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer py-16 w-full h-full">
                      <PhotoIcon className="w-12 h-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-black text-slate-700 uppercase tracking-wider">Deploy Event Asset</span>
                      <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.title ? 'text-rose-500' : 'text-slate-500'}`}>
                      Event Heading {errors.title && '— Required'}
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`clean-input font-bold text-slate-900 shadow-sm ${errors.title ? 'error' : ''}`}
                      placeholder="Public title of the event..."
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
                        className={`clean-input font-bold text-slate-900 pr-10 appearance-none shadow-sm ${errors.category ? 'error' : ''}`}
                      >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.siteId ? 'text-rose-500' : 'text-slate-500'}`}>
                      Platform Host
                    </label>
                    <div className="relative group">
                      <select
                        value={formData.siteId}
                        onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                        className="clean-input font-bold text-slate-900 pr-10 appearance-none shadow-sm"
                      >
                        {websites.filter(s => s.id !== 'all').map((site) => (
                          <option key={site.id} value={site.id}>{site.name}</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.date ? 'text-rose-500' : 'text-slate-500'}`}>
                      Official Date {errors.date && '— Selection Needed'}
                    </label>
                    <div className="relative group">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={`clean-input font-bold text-slate-900 pl-11 shadow-sm ${errors.date ? 'error' : ''}`}
                      />
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 pb-2">
                <button type="submit" className="w-full premium-btn-primary py-5 text-lg shadow-xl shadow-indigo-100">
                  {editingEvent ? 'Authorize Update' : 'Command Profile Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaEvents;