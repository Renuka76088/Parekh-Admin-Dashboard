import { useState, useEffect } from 'react';
import {
  PlusIcon, PencilIcon, TrashIcon, PhotoIcon, XMarkIcon,
  GlobeAltIcon, CalendarIcon, ChevronDownIcon,
  DocumentTextIcon, EyeIcon
} from '@heroicons/react/24/outline';
import { blogApi } from '../utils/api';

const Blogs = () => {
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
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', siteId: 'ParekheTradeMarket02', status: 'draft' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({ title: false, content: false, siteId: false });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogApi.list(selectedWebsite === 'all' ? '' : selectedWebsite);
      setBlogs(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
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
    setEditingBlog(null);
    setFormData({ title: '', content: '', siteId: 'ParekheTradeMarket02', status: 'draft' });
    setImageFile(null);
    setImagePreview(null);
    setErrors({ title: false, content: false, siteId: false });
    setShowModal(true);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({ title: blog.title, content: blog.content, siteId: blog.siteId, status: blog.status });
    setImageFile(null);
    setImagePreview(`http://localhost:5000/${blog.thumbnail}`);
    setErrors({ title: false, content: false, siteId: false });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Archive this blog post? It will be permanently removed from all live sites.")) {
      try {
        await blogApi.delete(id);
        fetchBlogs();
      } catch (error) {
        alert("Operation denied: Server protocol violation.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Expert Validation
    const newErrors = {
      title: !formData.title,
      content: !formData.content,
      siteId: !formData.siteId
    };
    setErrors(newErrors);

    if (newErrors.title || newErrors.content || newErrors.siteId) return;

    if (!editingBlog && !imageFile) {
      alert("Banner image is essential for new publication.");
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('siteId', formData.siteId);
    data.append('status', formData.status);
    if (imageFile) data.append('thumbnail', imageFile);

    try {
      if (editingBlog) {
        await blogApi.update(editingBlog._id, data);
      } else {
        await blogApi.add(data);
      }
      setShowModal(false);
      fetchBlogs();
    } catch (error) {
      alert("Submission aborted. Database fault or file upload error.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Content Strategy</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Blog Publications</h2>
          <p className="mt-1 text-slate-500 font-medium">Coordinate press releases and industry insights across the ecosystem.</p>
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
            Draft New Post
          </button>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-sm font-bold text-slate-500 mt-4">Syncing Global Press Desk...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="bg-slate-50 p-6 rounded-[2.5rem] inline-block border border-slate-100">
              <DocumentTextIcon className="w-10 h-10 text-slate-200" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mt-4 tracking-tight">Publishing Queue Empty</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Start drafting your first insight.</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="premium-card overflow-hidden group flex flex-col sm:flex-row">
              <div className="w-full sm:w-64 shrink-0 bg-slate-100 overflow-hidden relative border-b sm:border-b-0 sm:border-r border-slate-100">
                <img
                  src={`http://localhost:5000/${blog.thumbnail}`}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest border border-white/20 backdrop-blur-md ${blog.status === 'published' ? 'bg-emerald-500/80 text-white' : 'bg-slate-900/80 text-white'
                    }`}>
                    {blog.status}
                  </span>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col bg-gradient-to-br from-white to-slate-50/50">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-widest">{blog.siteId?.replace('Parekh', '')}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(blog)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(blog._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h5 className="text-xl font-black text-slate-900 tracking-tight mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                  {blog.title}
                </h5>
                <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {blog.content}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100/60">
                  <div className="flex items-center gap-1.5 text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                    <CalendarIcon className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {new Date(blog.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-slate-200 animate-fade-in-up">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingBlog ? 'Refine Publication' : 'Initialize Insight'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Edit Mode Architecture</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] p-4 bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer group">
                    {imagePreview ? (
                      <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-lg">
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-4 right-4 bg-white/90 p-2 rounded-xl text-rose-500"><XMarkIcon className="w-5 h-5" /></button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer py-16 w-full h-full">
                        <PhotoIcon className="w-12 h-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-black text-slate-700 uppercase tracking-wider">Upload Banner</span>
                        <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.title ? 'text-rose-500' : 'text-slate-500'}`}>
                      Publication Title {errors.title && '— Required'}
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`clean-input font-bold text-slate-900 ${errors.title ? 'error' : ''}`}
                      placeholder="Compelling headline..."
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.siteId ? 'text-rose-500' : 'text-slate-500'}`}>
                      Host Platform
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

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-3 mb-2">Publishing Status</label>
                    <div className="flex gap-4 p-2 bg-slate-100 rounded-2xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'draft' })}
                        className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${formData.status === 'draft' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                          }`}
                      >
                        Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'published' })}
                        className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${formData.status === 'published' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                          }`}
                      >
                        Published
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className={`block text-[10px] font-black uppercase tracking-widest ml-3 mb-2 ${errors.content ? 'text-rose-500' : 'text-slate-500'}`}>
                    Content Payload {errors.content && '— Empty body forbidden'}
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className={`clean-input font-medium text-slate-800 h-64 resize-none leading-relaxed px-6 py-5 ${errors.content ? 'error' : ''}`}
                    placeholder="Begin drafting the narrative..."
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full premium-btn-primary py-5 text-lg shadow-xl shadow-indigo-100">
                  {editingBlog ? 'Authorize Modification' : 'Command Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;