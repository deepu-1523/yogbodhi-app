import axios from 'axios';
import React, { useState } from 'react';
import api from '../../services/endpoints';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { User, BookOpen, Check, ChevronRight, ChevronLeft, Globe, Apple } from 'lucide-react';
import Footer from '../mainLayout/Footer';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '',
    dateofBirth: '', gender: '', currentClass: '',
    interestedCourse: '', address: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(api.student.register, formData);
      toast.success("Welcome aboard!");
      navigate("/stdlogin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8faff] bg-line-grid flex flex-col font-poppins">

      {/* Main Container - Sharp & Pro */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <div className="w-full max-w-[1100px] min-h-[600px] md:h-[720px] bg-white rounded-[40px] border border-gray-100 flex overflow-hidden relative shadow-xl">

        {/* Left Side: Multi-Step Form */}
        <div className="w-full md:w-[45%] p-8 md:p-14 flex flex-col justify-between relative z-10 border-r border-gray-50">
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="Roots Classes" className="h-8 w-auto" />
                <div className="h-4 w-[1px] bg-gray-200" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {step}/3</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(s => <div key={s} className={`h-1 rounded-full transition-all duration-300 ${step === s ? 'w-6 bg-[#0078FF]' : 'w-1 bg-gray-100'}`} />)}
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create account</h1>
              <p className="text-sm text-gray-400">Join the Roots Classes community.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Step 1: Identity */}
              {step === 1 && (
                <div className="animate-slideIn space-y-5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-full py-3.5 px-6 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all text-sm outline-none" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-full py-3.5 px-6 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all text-sm outline-none" placeholder="name@example.com" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
                    <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-full py-3.5 px-6 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all text-sm outline-none" placeholder="••••••••" />
                  </div>
                </div>
              )}

              {/* Step 2: Academic */}
              {step === 2 && (
                <div className="animate-slideIn space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">DOB</label>
                      <input type="date" name="dateofBirth" required value={formData.dateofBirth} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-full py-3.5 px-6 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] text-sm outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Gender</label>
                      <select name="gender" required value={formData.gender} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-full py-3.5 px-6 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] text-sm outline-none appearance-none">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Current Class</label>
                    <select name="currentClass" required value={formData.currentClass} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-full py-3.5 px-6 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] text-sm outline-none appearance-none">
                      <option value="">Select Class</option>
                      {['8th', '9th', '10th', '11th', '12th', 'Dropper'].map(c => <option key={c} value={c}>{c} Class</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Finalize */}
              {step === 3 && (
                <div className="animate-slideIn space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-full py-3.5 px-6 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] text-sm outline-none" placeholder="10-digit mobile" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Course</label>
                      <select name="interestedCourse" required value={formData.interestedCourse} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-full py-3.5 px-6 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] text-sm outline-none appearance-none">
                        <option value="">Select Course</option>
                        <option value="foundation">Foundation</option>
                        <option value="medical">NEET</option>
                        <option value="engineering">IIT-JEE</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} rows="1" className="w-full bg-gray-50 border border-gray-100 rounded-[20px] py-3 px-6 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] text-sm outline-none resize-none" placeholder="Enter full address" />
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="flex-1 border border-gray-100 text-gray-400 py-3.5 rounded-full font-bold hover:text-gray-900 transition-all flex items-center justify-center gap-2 text-xs">
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" onClick={() => setStep(step + 1)} className="flex-[2] bg-[#0a1628] text-white py-3.5 rounded-full font-bold hover:bg-[#0078FF] transition-all flex items-center justify-center gap-2 text-xs">
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="flex-[2] bg-[#ba9d25] text-white py-3.5 rounded-full font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-xs">
                    {loading ? 'Processing...' : 'Register Account'} <Check size={16} />
                  </button>
                )}
              </div>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"><Apple size={18} /></button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"><Globe size={18} /></button>
            </div>
          </div>

          <div className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6">
            Already registered? <Link to="/stdlogin" className="text-[#0078FF] border-b border-[#0078FF]">Sign In</Link>
          </div>
        </div>

        {/* Right Side: Visual Section - Sharp & Pro */}
        <div className="hidden md:flex flex-1 m-4 rounded-[32px] relative overflow-hidden group">
          <img
            src="/assets/student_study.png"
            alt="Students"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#0a1628]/10" />

          <div className="absolute top-0 right-0 bg-[#ffcf5c] p-4 rounded-4xl border border-yellow-400/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-yellow-900 mb-1">Scholarship Open</p>
            <p className="text-sm font-bold text-gray-900">Get up to 100% off</p>
          </div>

          <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[24px] text-white">
            <p className="text-xs font-bold mb-4 opacity-80 uppercase tracking-widest">Global Ranking</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">#1 Institute</p>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-white/20 border border-white/10" />)}
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideIn { animation: slideIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};


export default StudentRegistration;