import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import axios from 'axios';
import api from '../../services/endpoints';
import useStudentStore from '../../Store/studentstore';

/* ── decorative education SVG ────────────────────────────────────────────── */
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full opacity-20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L18 8.625" />
  </svg>
);

const inputCls = (err) =>
  `w-full px-4 py-3 bg-white border rounded-xl text-sm outline-none transition-all duration-200 ${
    err
      ? 'border-yellow-400 focus:ring-2 focus:ring-yellow-200'
      : 'border-gray-200 focus:border-[#0078FF] focus:ring-2 focus:ring-blue-100'
  }`;
const labelCls = 'block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2';

/* ── component ───────────────────────────────────────────────────────────── */
const Contact = () => {
  const { student } = useStudentStore();

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors,       setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fill = (s) => s && setFormData(p => ({ ...p, name: s.fullName || s.name || '', email: s.email || '' }));
    if (student) { fill(student); return; }
    try { fill(JSON.parse(localStorage.getItem('student') || '{}')); } catch {}
  }, [student]);

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) e.name = 'Please enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))       e.email = 'Please enter a valid email';
    if (!formData.subject.trim())                                   e.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await axios.post(api.callback.contact, formData);
      if (res.data.success) {
        setSubmitStatus('success');
        setFormData(p => ({ ...p, subject: '', message: '' }));
      } else {
        setSubmitStatus('error');
      }
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero (Light & Sleek) ── */}
      <div className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Dot pattern matching StatsBar */}
        <div className="absolute inset-0 opacity-[0.4]" style={{
          backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        
        {/* Subtle glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0078FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ba9d25]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0078FF]"></span>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Get in Touch</p>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                Let's start a<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ba9d25] via-[#0078FF] to-[#28A745]">
                  conversation
                </span>
              </h1>
            </div>

            {/* Quick Connect Badges - Compact */}
            <div className="flex flex-wrap gap-4 md:px-10 md:border-l border-gray-100">
              {[
                { t: '⚡ Fast Reply', c: '#ba9d25' },
                { t: '📍 Ludhiana', c: '#0078FF' },
                { t: '🎓 10K+ Guided', c: '#28A745' }
              ].map(item => (
                <span key={item.t} className="text-[10px] font-bold px-3 py-2 rounded-lg bg-gray-50 text-gray-500 border border-gray-100 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: item.c }}></span>
                  {item.t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Connect strip ───────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '📞', label: 'Call Us', value: '+91 98775-15330', hint: 'Mon–Sat, 9am–6pm', bg: 'hover:border-yellow-200 hover:bg-yellow-50', accent: 'text-[#ba9d25]', href: 'tel:+919877515330' },
              { icon: '✉️', label: 'Email Us', value: 'rootsclasses1313@gmail.com', hint: 'We reply within 24h', bg: 'hover:border-blue-200 hover:bg-blue-50', accent: 'text-[#0078FF]', href: 'mailto:rootsclasses1313@gmail.com?subject=Root%20classes%20enquiry&body=Hi%2C%20I%20wanted%20to%20enquire%20about...' },
              { icon: '💬', label: 'WhatsApp', value: 'Chat with us', hint: 'Quick responses', bg: 'hover:border-green-200 hover:bg-green-50', accent: 'text-green-600', href: 'https://wa.me/919877515330' },
            ].map(item => (
              <a key={item.label} 
                href={item.label === 'Email Us' 
                  ? `https://mail.google.com/mail/?view=cm&fs=1&to=rootsclasses1313@gmail.com&su=Root%20classes%20enquiry&body=Hi%2C%20I%20wanted%20to%20enquire%20about...`
                  : item.href
                }
                onClick={async (e) => {
                  if (item.label === 'Email Us') {
                    // Use Nodemailer to notify admin of interest
                    try {
                      axios.post(api.callback.contact, {
                        name: student?.fullName || 'Interested Student',
                        email: student?.email || 'via Quick Link',
                        subject: 'Quick Email Link Clicked',
                        message: 'A student just clicked the direct email card to contact you via Gmail.'
                      });
                    } catch (err) { console.error(err); }
                  }
                }}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 rounded-2xl border border-gray-100 transition-all group cursor-pointer ${item.bg}`}>
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.label}</p>
                  <p className={`text-sm font-semibold ${item.accent} group-hover:underline`}>{item.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.hint}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      <div className="bg-dot-grid py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── Left column ── */}
            <div className="lg:col-span-4 space-y-4">

              {/* Address card — dark */}
              <div className="bg-white rounded-2xl p-6 relative overflow-hidden border border-gray-100 shadow-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#0078FF]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[#ba9d25]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-[#ba9d25] uppercase tracking-widest mb-1">Our Location</p>
                <h3 className="font-bold text-gray-900 mb-2">Ludhiana Centre</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Gill Rd, opp. ITI College,<br />Shilapuri, Ludhiana,<br />Punjab — 141003
                </p>
                <a href="https://maps.google.com/?q=Roots+Classes+Ludhiana" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-[#0078FF] hover:underline">
                  Open in Maps →
                </a>
              </div>

              {/* Office Hours */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[#0078FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-[#0078FF] uppercase tracking-widest mb-3">Office Hours</p>
                <div className="space-y-2">
                  {[
                    { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM', active: true },
                    { day: 'Saturday',        time: '9:00 AM – 4:00 PM', active: true },
                    { day: 'Sunday',          time: 'Closed',            active: false },
                  ].map(r => (
                    <div key={r.day} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{r.day}</span>
                      <span className={`text-xs font-semibold ${r.active ? 'text-gray-900' : 'text-gray-400'}`}>{r.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Follow Us</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: 'Facebook',  href: 'https://www.facebook.com/rootsclasses1313/', color: 'hover:bg-blue-600',  icon: <FaFacebook size={18} /> },
                    { name: 'Instagram', href: 'https://www.instagram.com/roots_classes', color: 'hover:bg-pink-600',  icon: <FaInstagram size={18} /> },
                    { name: 'LinkedIn',  href: 'https://www.linkedin.com/company/roots-classes/', color: 'hover:bg-blue-700', icon: <FaLinkedin size={18} /> },
                    { name: 'YouTube',   href: 'https://www.youtube.com/@nikolaphysics', color: 'hover:bg-yellow-600',   icon: <FaYoutube size={18} /> },
                  ].map(s => (
                    <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                      className={`w-full aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 transition-all hover:text-white hover:shadow-sm ${s.color}`}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Logged-in student card */}
              {student && (
                <div className="bg-white rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ba9d25] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{student.fullName}</p>
                      <p className="text-xs text-gray-400 truncate">{student.email}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#0078FF] mt-3 font-medium">✓ Form pre-filled from your profile</p>
                </div>
              )}
            </div>

            {/* ── Right column — Form ── */}
            <div className="lg:col-span-8" id="contact-form">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

                {/* Form header */}
                <div className="bg-gray-50/50 px-8 py-6 relative overflow-hidden border-b border-gray-100">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#0078FF]/5 rounded-full blur-3xl pointer-events-none" />
                  {/* Notebook line decoration */}
                  <div className="absolute bottom-3 left-8 flex gap-3 opacity-20">
                    {[60,80,50,70].map((w,i) => (
                      <div key={i} className="h-px bg-[#0078FF]" style={{ width: `${w}px` }} />
                    ))}
                  </div>
                  <div className="relative">
                    <p className="text-xs font-bold text-[#0078FF] uppercase tracking-widest mb-1">Drop a Message</p>
                    <h2 className="text-xl font-bold text-gray-900">Send us a message</h2>
                    <p className="text-gray-500 text-xs mt-1">We typically respond within one business day.</p>
                  </div>
                </div>

                {/* Form body — notebook bg */}
                <div className="bg-notebook p-8">

                  {/* Status banners */}
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                      <span className="text-green-500 text-lg">✓</span>
                      <p className="text-sm text-green-700 font-medium">Message sent! We'll get back to you soon.</p>
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
                      <span className="text-yellow-500 text-lg">✕</span>
                      <p className="text-sm text-red-700 font-medium">Something went wrong. Please try again.</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>Full Name <span className="text-[#ba9d25]">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                          readOnly={!!student} placeholder="Your full name"
                          className={inputCls(errors.name) + (student ? ' bg-gray-50 text-gray-500 cursor-not-allowed' : '')} />
                        {errors.name && <p className="mt-1.5 text-xs text-yellow-500">{errors.name}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Email Address <span className="text-[#ba9d25]">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                          readOnly={!!student} placeholder="your@email.com"
                          className={inputCls(errors.email) + (student ? ' bg-gray-50 text-gray-500 cursor-not-allowed' : '')} />
                        {errors.email && <p className="mt-1.5 text-xs text-yellow-500">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className={labelCls}>Subject <span className="text-[#ba9d25]">*</span></label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {['Admission Query', 'Fee Structure', 'Course Info', 'Other'].map(s => (
                          <button key={s} type="button"
                            onClick={() => setFormData(p => ({ ...p, subject: s }))}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                              formData.subject === s
                                ? 'bg-[#0078FF] text-white border-[#0078FF]'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#0078FF] hover:text-[#0078FF]'
                            }`}
                          >{s}</button>
                        ))}
                      </div>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                        placeholder="Or type your own subject…"
                        className={inputCls(errors.subject)} />
                      {errors.subject && <p className="mt-1.5 text-xs text-yellow-500">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className={labelCls}>Your Message <span className="text-[#ba9d25]">*</span></label>
                      <textarea name="message" rows={5} value={formData.message} onChange={handleChange}
                        placeholder="Tell us more about your inquiry — the more detail, the better we can help…"
                        className={inputCls(errors.message) + ' resize-none'} />
                      <div className="flex items-center justify-between mt-1.5">
                        {errors.message
                          ? <p className="text-xs text-yellow-500">{errors.message}</p>
                          : <span />}
                        <span className="text-xs text-gray-300">{formData.message.length} chars</span>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button type="submit" disabled={isSubmitting}
                        className="flex-1 py-3 bg-[#ba9d25] text-white font-bold rounded-xl text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                        ) : (
                          <>Send Message <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></>
                        )}
                      </button>
                      <a href="https://wa.me/919877515330" target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 py-3 px-5 bg-green-500 text-white font-bold rounded-xl text-sm hover:bg-green-600 transition flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12.004 0C5.374 0 0 5.373 0 12c0 2.116.554 4.106 1.523 5.835L.057 23.857l6.198-1.43A11.94 11.94 0 0012.004 24C18.629 24 24 18.627 24 12S18.629 0 12.004 0zm0 21.818a9.823 9.823 0 01-5.002-1.368l-.36-.214-3.677.964.982-3.587-.235-.369A9.82 9.82 0 012.182 12c0-5.424 4.414-9.836 9.822-9.836S21.818 6.576 21.818 12c0 5.424-4.41 9.818-9.814 9.818z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Map + Visit Section ───────────────────────────────────────────── */}
      <div className="bg-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Map embed */}
            <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-72">
              <iframe
                title="Roots Classes Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3418.0!2d75.85!3d30.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRoots+Classes+Ludhiana!5e0!3m2!1sen!2sin!4v1"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Visit us card */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-gray-50 rounded-2xl p-7 flex-1 relative overflow-hidden border border-gray-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0078FF]/5 rounded-full blur-2xl pointer-events-none" />
                <p className="text-xs font-bold text-[#0078FF] uppercase tracking-widest mb-3 relative">Visit Us</p>
                <h3 className="text-lg font-bold text-gray-900 mb-3 relative">Come see us<br />in person</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative">
                  Gill Rd, opp. ITI College,<br />Shilapuri, Ludhiana,<br />Punjab — 141003
                </p>
                <a href="https://maps.google.com/?q=Gill+Road+ITI+College+Shilapuri+Ludhiana" target="_blank" rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-2 mt-5 px-4 py-2 bg-[#ba9d25] text-white text-xs font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-yellow-100">
                  Get Directions →
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;
