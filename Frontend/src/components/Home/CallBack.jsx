import React, { useState } from 'react';
import axios from 'axios';
import api from '../../services/endpoints';
import { toast } from 'react-toastify';

const benefits = [
  { icon: '🎯', title: 'Free Career Counseling', desc: 'Expert guidance on your future path' },
  { icon: '📋', title: 'Personalized Study Plan', desc: 'Tailored roadmap for your goals' },
  { icon: '📚', title: 'Course Recommendations', desc: 'Best programs based on your profile' },
];

const ExpertConsultationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', mobileNo: '', stream: '', class: '', emailId: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mobileNo.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(api.callback.request, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobileNumber: formData.mobileNo,
        email: formData.emailId,
        stream: formData.stream,
        studentClass: formData.class,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({ firstName: '', lastName: '', mobileNo: '', stream: '', class: '', emailId: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ba9d25] focus:border-transparent transition outline-none bg-gray-50 focus:bg-white';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5';

  return (
    <div className="bg-line-grid py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Left Info Panel */}
          <div className="lg:w-2/5 lg:sticky lg:top-24">
            <p className="text-xs font-bold text-[#ba9d25] uppercase tracking-widest mb-3">Get in Touch</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Talk to our <span className="text-[#ba9d25]">Expert</span>
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Get personalized guidance from our education experts. Fill in your details and we'll reach out to you shortly.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((b) => (
                <div key={b.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-lg flex-shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{b.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 flex gap-8">
              <div>
                <div className="text-2xl font-bold text-[#ba9d25]">10,000+</div>
                <div className="text-xs text-gray-400 mt-0.5">Students Counseled</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#ba9d25]">98%</div>
                <div className="text-xs text-gray-400 mt-0.5">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:w-3/5 w-full">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Request a Callback</h3>
              <p className="text-xs text-gray-400 mb-6">Our expert will contact you within 24 hours</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>First Name <span className="text-yellow-500">*</span></label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className={inputCls} placeholder="First name" />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputCls} placeholder="Last name" />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Mobile Number <span className="text-yellow-500">*</span></label>
                  <input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleChange} maxLength="10" required className={inputCls} placeholder="10-digit mobile number" />
                </div>

                <div>
                  <label className={labelCls}>Email ID <span className="text-yellow-500">*</span></label>
                  <input type="email" name="emailId" value={formData.emailId} onChange={handleChange} required className={inputCls} placeholder="your@email.com" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Stream <span className="text-yellow-500">*</span></label>
                    <select name="stream" value={formData.stream} onChange={handleChange} required className={inputCls}>
                      <option value="">Select Stream</option>
                      <option value="science">Science (PCM/PCB)</option>
                      <option value="commerce">Commerce</option>
                      <option value="arts">Arts/Humanities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Class <span className="text-yellow-500">*</span></label>
                    <select name="class" value={formData.class} onChange={handleChange} required className={inputCls}>
                      <option value="">Select Class</option>
                      <option value="8th">Class 8th</option>
                      <option value="9th">Class 9th</option>
                      <option value="10th">Class 10th</option>
                      <option value="11th">Class 11th</option>
                      <option value="12th">Class 12th</option>
                      <option value="dropper">Dropper</option>
                      <option value="graduate">Graduate</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" required className="mt-0.5 w-4 h-4 accent-[#ba9d25] border-gray-300 rounded" />
                  <label htmlFor="terms" className="text-xs text-gray-500">
                    By submitting, I agree to receive WhatsApp communication and accept Roots Classes'{' '}
                    <a href="/termsandconditions" className="text-[#ba9d25] hover:underline">T&C</a> &{' '}
                    <a href="/privacypolicy" className="text-[#ba9d25] hover:underline">Privacy Policy</a>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-[#ba9d25] to-[#a88c21] text-white font-semibold rounded-xl text-sm hover:from-[#a88c21] hover:to-[#947b1c] hover:shadow-lg hover:shadow-yellow-200 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Request Callback →'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExpertConsultationForm;
