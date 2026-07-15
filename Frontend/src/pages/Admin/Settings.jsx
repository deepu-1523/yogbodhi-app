import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Monitor, 
  Save, 
  ShieldCheck, 
  Smartphone,
  Eye,
  EyeOff,
  Zap as ZapIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import useStudentStore from '../../Store/studentstore';

const Settings = () => {
  const { student, setStudent } = useStudentStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (student) {
      setFormData(prev => ({
        ...prev,
        fullName: student.fullName || student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        address: student.address || ''
      }));
    }
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/student/edit-profile-details`, {
        studentId: student._id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });

      if (response.data.success) {
        setStudent({ user: response.data.user, token: localStorage.getItem('token') });
        toast.success('Profile Intelligence Updated');
      }
    } catch (error) {
      toast.error('Update Failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/student/reset-password`, {
        email: student.email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      if (response.data.success) {
        toast.success('Security Credentials Reset');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      }
    } catch (error) {
      toast.error('Security Update Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] bg-line-grid font-poppins p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header - Industrial Pro */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <div className="w-1.5 h-1.5 rounded-full bg-[#ba9d25]" />
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Portal / Control</p>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none uppercase">Settings</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="space-y-1">
             {[
               { id: 'profile', label: 'Identity', icon: User },
               { id: 'security', label: 'Security', icon: Lock },
               { id: 'notifications', label: 'Alerts', icon: Bell },
               { id: 'appearance', label: 'Interface', icon: Monitor },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#0078FF] text-white shadow-lg shadow-blue-500/20' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
               >
                 <tab.icon size={16} />
                 {tab.label}
               </button>
             ))}
          </div>

          {/* Settings Content Area */}
          <div className="lg:col-span-3">
             <div className="bg-white rounded-[24px] border border-gray-100 shadow-2xl shadow-blue-900/5 overflow-hidden">
                
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate} className="animate-fadeIn">
                    <div className="p-8 border-b border-gray-50">
                       <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Identity Management</h2>
                       <p className="text-[11px] font-bold text-gray-400 uppercase">Update your public profile and contact intelligence.</p>
                    </div>
                    <div className="p-8 space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
                             <div className="relative">
                                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input name="fullName" type="text" value={formData.fullName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-xs font-black focus:outline-none focus:border-[#0078FF] transition-all" />
                             </div>
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Identity</label>
                             <div className="relative">
                                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-xs font-black focus:outline-none focus:border-[#0078FF] transition-all" />
                             </div>
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Phone Intelligence</label>
                             <div className="relative">
                                <Smartphone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input name="phone" type="text" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-xs font-black focus:outline-none focus:border-[#0078FF] transition-all" />
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="p-8 bg-gray-50/50 flex justify-end">
                       <button disabled={loading} type="submit" className="flex items-center gap-2 bg-[#0078FF] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0060cc] transition-all disabled:opacity-50">
                          <Save size={16} /> {loading ? 'Processing...' : 'Sync Profile'}
                       </button>
                    </div>
                  </form>
                )}

                {activeTab === 'security' && (
                  <form onSubmit={handlePasswordUpdate} className="animate-fadeIn">
                    <div className="p-8 border-b border-gray-50">
                       <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Security Protocols</h2>
                       <p className="text-[11px] font-bold text-gray-400 uppercase">Manage your credentials and system access.</p>
                    </div>
                    <div className="p-8 space-y-6">
                       <div className="max-w-md space-y-4">
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">New Password</label>
                             <div className="relative">
                                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input name="newPassword" type={showPassword ? "text" : "password"} value={formData.newPassword} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-11 text-xs font-black focus:outline-none focus:border-[#ba9d25] transition-all" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors">
                                   {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                             </div>
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Confirm Authorization</label>
                             <div className="relative">
                                <ShieldCheck size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-xs font-black focus:outline-none focus:border-[#ba9d25] transition-all" />
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="p-8 bg-gray-50/50 flex justify-end">
                       <button disabled={loading} type="submit" className="flex items-center gap-2 bg-[#ba9d25] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d00400] transition-all">
                          <ZapIcon size={16} /> Update Credentials
                       </button>
                    </div>
                  </form>
                )}

                {activeTab === 'appearance' && (
                  <div className="animate-fadeIn p-8">
                    <div className="border-b border-gray-50 pb-8 mb-8">
                       <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Interface Controls</h2>
                       <p className="text-[11px] font-bold text-gray-400 uppercase">Customize your portal density and aesthetics.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <button className="flex flex-col gap-4 p-6 rounded-2xl border-2 border-[#0078FF] bg-blue-50/50 text-left transition-all">
                          <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-[#0078FF]">
                             <Monitor size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Industrial Density</p>
                             <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 leading-relaxed">Maximum information per pixel. Optimized for instructor productivity.</p>
                          </div>
                          <div className="mt-auto">
                             <span className="px-3 py-1 bg-[#0078FF] text-white text-[8px] font-black rounded-lg uppercase tracking-widest">Active</span>
                          </div>
                       </button>
                       <button className="flex flex-col gap-4 p-6 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 text-left transition-all group">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-gray-400">
                             <Monitor size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Standard Layout</p>
                             <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 leading-relaxed">Relaxed spacing and larger typography. Optimized for presentation.</p>
                          </div>
                       </button>
                    </div>
                  </div>
                )}

             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Settings;
