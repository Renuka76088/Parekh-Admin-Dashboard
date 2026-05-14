import { useState, useEffect } from 'react';
import {
  PlusIcon, PencilIcon, TrashIcon, XMarkIcon,
  ChevronDownIcon, UserGroupIcon, PhotoIcon, CheckIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { managementApi } from '../utils/api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const Management = () => {
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

  const [user] = useState(JSON.parse(localStorage.getItem('hc_admin_user') || '{}'));
  const [selectedWebsite, setSelectedWebsite] = useState(user.siteId || 'ParekhChamberofTextile01');

  // Content state
  const [content, setContent] = useState({ title: 'OUR MANAGEMENT', description: '' });
  const [contentLoading, setContentLoading] = useState(false);
  const [contentSaving, setContentSaving] = useState(false);

  // Members state
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberFormData, setMemberFormData] = useState({ name: '', role: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [memberSubmitting, setMemberSubmitting] = useState(false);

  const fetchData = async () => {
    if (selectedWebsite === 'all') return;
    
    try {
      setContentLoading(true);
      setMembersLoading(true);
      
      const [contentRes, membersRes] = await Promise.all([
        managementApi.getContent(selectedWebsite),
        managementApi.getMembers(selectedWebsite)
      ]);
      
      setContent(contentRes.data.data);
      setMembers(membersRes.data.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setContentLoading(false);
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedWebsite]);

  const handleContentSave = async () => {
    try {
      setContentSaving(true);
      await managementApi.updateContent({ ...content, siteId: selectedWebsite });
      alert("Page content updated successfully!");
    } catch (error) {
      alert("Failed to update page content.");
    } finally {
      setContentSaving(false);
    }
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setMemberFormData({ name: '', role: '' });
    setImageFile(null);
    setImagePreview(null);
    setShowMemberModal(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setMemberFormData({ name: member.name, role: member.role });
    setImagePreview(member.image);
    setImageFile(null);
    setShowMemberModal(true);
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        await managementApi.deleteMember(id);
        fetchData();
      } catch (error) {
        alert("Deletion failed.");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    if (!memberFormData.name || !memberFormData.role || (!imageFile && !editingMember)) {
      alert("Please fill all required fields and select an image.");
      return;
    }

    try {
      setMemberSubmitting(true);
      const data = new FormData();
      data.append('name', memberFormData.name);
      data.append('role', memberFormData.role);
      data.append('siteId', selectedWebsite);
      if (imageFile) data.append('image', imageFile);

      if (editingMember) {
        await managementApi.updateMember(editingMember._id, data);
      } else {
        await managementApi.addMember(data);
      }
      
      setShowMemberModal(false);
      fetchData();
    } catch (error) {
      alert("Operation failed.");
    } finally {
      setMemberSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Organization</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Our Management</h2>
          <p className="mt-1 text-slate-500 font-medium">Configure page content and leadership team.</p>
        </div>

        {user.siteId === 'all' && (
          <div className="relative group min-w-[250px]">
            <select
              value={selectedWebsite}
              onChange={(e) => setSelectedWebsite(e.target.value)}
              className="clean-input pr-10 appearance-none font-bold text-slate-900 cursor-pointer shadow-sm bg-white"
            >
              {websites.filter(s => s.id !== 'all').map(site => <option key={site.id} value={site.id}>{site.name}</option>)}
            </select>
            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
          </div>
        )}
      </div>

      {/* Page Content Section */}
      <div className="premium-card p-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <PencilSquareIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Page Branding</h3>
          </div>
          <button 
            onClick={handleContentSave}
            disabled={contentSaving}
            className="premium-btn-primary gap-2 h-12 px-6"
          >
            {contentSaving ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckIcon className="h-5 w-5" />
            )}
            {contentSaving ? 'Saving...' : 'Save Branding'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Display Title</label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="clean-input font-bold text-slate-900"
              placeholder="e.g. OUR MANAGEMENT"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Page Description / Introduction</label>
            <div className="h-[300px] mb-12">
              <ReactQuill
                theme="snow"
                value={content.description}
                onChange={(val) => setContent({ ...content, description: val })}
                className="bg-slate-50 rounded-2xl overflow-hidden border-slate-200 h-full flex flex-col"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Leadership Team</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage executive members</p>
            </div>
          </div>
          <button onClick={handleAddMember} className="premium-btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Member
          </button>
        </div>

        {membersLoading ? (
          <div className="py-20 text-center">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="premium-card py-20 text-center border-dashed">
            <UserGroupIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h4 className="text-lg font-black text-slate-900 tracking-tight">No Members Added Yet</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Start building your management team</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member._id} className="premium-card p-6 group transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                    <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 truncate">{member.name}</h4>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">{member.role}</p>
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditMember(member)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteMember(member._id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowMemberModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingMember ? 'Edit Profile' : 'New Member'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Team Configuration</p>
              </div>
              <button onClick={() => setShowMemberModal(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="p-10 space-y-8">
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-[2rem] border-4 border-slate-50 bg-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <PhotoIcon className="h-10 w-10 text-slate-300" />
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform pointer-events-none">
                    <PlusIcon className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={memberFormData.name}
                    onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                    className="clean-input font-bold text-slate-900"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 mb-2">Designation / Role</label>
                  <input
                    type="text"
                    value={memberFormData.role}
                    onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                    className="clean-input font-bold text-slate-900"
                    placeholder="e.g. Managing Director"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={memberSubmitting}
                className="w-full premium-btn-primary py-5 text-lg shadow-xl shadow-indigo-100 disabled:opacity-70"
              >
                {memberSubmitting ? 'Processing...' : editingMember ? 'Update Profile' : 'Authorize Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;
