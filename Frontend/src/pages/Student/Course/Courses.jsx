import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useStudentStore from '../../../Store/studentstore';
import api from '../../../services/endpoints';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const getImg = (courseId, courseTitle, category) => {
  const sets = {
    programming: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop'],
    business: ['https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&h=300&fit=crop', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=300&fit=crop'],
    design: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop', 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&h=300&fit=crop'],
    data: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop', 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=300&fit=crop'],
    default: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop'],
  };
  const cat = (category || '').toLowerCase();
  const ttl = (courseTitle || '').toLowerCase();
  let key = 'default';
  if (cat.includes('program') || ttl.includes('code') || ttl.includes('program')) key = 'programming';
  else if (cat.includes('business') || ttl.includes('business')) key = 'business';
  else if (cat.includes('design') || ttl.includes('design')) key = 'design';
  else if (cat.includes('data') || ttl.includes('data')) key = 'data';
  const arr = sets[key];
  const hash = parseInt(courseId?.toString().slice(-4) || '0', 16) || 0;
  return arr[hash % arr.length];
};

const hasPaid = (c) => c?.modules?.some(m => m.chapters?.some(ch => ch.topics?.some(t => t.isPreviewFree === false)));
const isFree = (c) => (!c.price || c.price === 0) && !hasPaid(c);
const isPaid = (c) => (c.price && c.price > 0) || hasPaid(c);
const priceLabel = (c) => !c ? 'Free' : c.price > 0 ? `₹${c.price.toLocaleString('en-IN')}` : hasPaid(c) ? 'Premium' : 'Free';
const topicCount = (c) => c.modules?.reduce((t, m) => t + (m.chapters?.reduce((a, ch) => a + (ch.topics?.length || 0), 0) || 0), 0) || 0;

/* ─── component ───────────────────────────────────────────────────────────── */
const ClassroomCourses = () => {
  const navigate = useNavigate();
  const { student } = useStudentStore();
  const studentId = student?._id;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  const GetFullCourse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(api.fullcourse.getApprovedcourse);
      console.log(res)
      let data = res.data?.data?.data || res.data?.data || (Array.isArray(res.data) ? res.data : res.data?.courses) || [];
      setCourses(data);
      setCategories(['All', ...new Set(data.map(c => c.category?.name || 'Uncategorized'))]);
    } catch { setError('Failed to load courses. Please try again.'); }
    finally { setLoading(false); }
  };

  const fetchEnrolled = async () => {
    if (!studentId) return;
    try {
      const res = await axios.get(`${api.student.getStudentProfile}/${studentId}`);
      if (res.data?.success) setEnrolledCourses(res.data.data?.enrolledCourses || []);
    } catch { }
  };

  useEffect(() => { GetFullCourse(); }, []);
  useEffect(() => { if (studentId) fetchEnrolled(); }, [studentId]);

  const isEnrolled = (id) => enrolledCourses.includes(id);

  const filtered = courses.filter(c => {
    const matchCat = selectedCategory === 'All' || (c.category?.name || 'Uncategorized') === selectedCategory;
    const matchSrc = !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrc;
  });

  const handleView = (course) => navigate('/coursedetails', { state: { course } });

  /* ── loading ── */
  if (loading) return (
    <div className="min-h-screen bg-dot-grid flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-[#ba9d25] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading courses…</p>
      </div>
    </div>
  );

  /* ── error ── */
  if (error) return (
    <div className="min-h-screen bg-dot-grid flex items-center justify-center">
      <div className="text-center bg-white rounded-2xl p-8 border border-gray-100 shadow-sm max-w-sm">
        <p className="text-gray-700 font-medium mb-4">{error}</p>
        <button onClick={GetFullCourse} className="px-5 py-2 bg-[#ba9d25] text-white text-sm font-semibold rounded-xl hover:opacity-90">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Banner (Light & Sleek) ── */}
      <div className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Dot pattern matching StatsBar */}
        <div className="absolute inset-0 opacity-[0.4]" style={{
          backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        {/* Subtle color glows for depth */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0078FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ba9d25]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0078FF]"></span>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Explore Programs</p>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Discover & Master<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ba9d25] via-[#0078FF] to-[#28A745]">
                  New Skills
                </span>
              </h1>
            </div>

            {/* Compact Stats */}
            <div className="flex gap-8 md:gap-12 md:px-8 md:border-x border-gray-100">
              <div>
                <span className="text-xl md:text-2xl font-black text-[#ba9d25]">{courses.length}+</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Courses</p>
              </div>
              <div>
                <span className="text-xl md:text-2xl font-black text-[#0078FF]">50+</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Faculty</p>
              </div>
              <div>
                <span className="text-xl md:text-2xl font-black text-[#28A745]">10K+</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Students</p>
              </div>
            </div>

            {/* Search - Sleeker version */}
            <div className="md:w-72">
              <div className="relative group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#0078FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search courses…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078FF]/10 focus:border-[#0078FF] transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters + View Toggle ── */}
      <div className="bg-white border-b border-gray-100 sticky top-[104px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 flex-1 flex-wrap">
            {categories.map((cat) => {
              const count = cat === 'All' ? courses.length : courses.filter(c => (c.category?.name || 'Uncategorized') === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                    ? 'bg-[#ba9d25] text-white shadow-sm shadow-yellow-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {cat}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-white text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 flex-shrink-0 bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm' : 'text-gray-400'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z" /></svg>
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm' : 'text-gray-400'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-gray-500 font-medium">No courses found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different category or search term</p>
            <button onClick={() => { setSelectedCategory('All'); setSearch(''); }} className="mt-5 px-5 py-2 bg-[#ba9d25] text-white text-sm font-semibold rounded-xl hover:opacity-90">
              Clear filters
            </button>
          </div>
        ) : view === 'list' ? (

          /* ── LIST VIEW ── */
          <div className="space-y-4">
            {filtered.map((course, i) => {
              const enrolled = isEnrolled(course._id);
              const free = isFree(course);
              const paid = isPaid(course);
              const img = getImg(course._id, course.title, course.category?.name);
              return (
                <div key={course._id}
                  className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all overflow-hidden flex gap-0"
                >
                  <div className="w-48 h-36 flex-shrink-0 overflow-hidden hidden sm:block">
                    <img src={img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop'; }} />
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{course.category?.name || 'General'}</span>
                        {enrolled && <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-600">Enrolled</span>}
                        {!enrolled && free && <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0078FF]">Free</span>}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#ba9d25] transition-colors line-clamp-1">{course.title}</h3>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-1 leading-relaxed">{course.description || 'No description available'}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>📖 {course.modules?.length || 0} modules</span>
                        <span>📝 {topicCount(course)} topics</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-gray-900 text-sm">{priceLabel(course)}</span>
                        <button onClick={() => handleView(course)}
                          className="px-4 py-1.5 bg-[#0078FF] text-white text-xs font-semibold rounded-xl hover:bg-[#ba9d25] transition-colors">
                          {enrolled ? 'Continue →' : 'View Details →'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        ) : (

          /* ── GRID VIEW — unique bento layout ── */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {filtered.map((course, i) => {
              const enrolled = isEnrolled(course._id);
              const free = isFree(course);
              const paid = isPaid(course);
              const img = getImg(course._id, course.title, course.category?.name);
              const price = priceLabel(course);
              const topics = topicCount(course);
              const modules = course.modules?.length || 0;

              /* Layout pattern: 7/5 alternating, every 3rd is full width on mobile */
              const isWide = i % 5 === 0;
              const isDark = false; // Always light

              return (
                <div
                  key={course._id}
                  className={`group ${isWide ? 'md:col-span-7' : 'md:col-span-5'} ${isDark ? 'bg-[#0a1628]' : 'bg-white'} rounded-2xl border ${isDark ? 'border-blue-900/30' : 'border-gray-100'} overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden flex-shrink-0 ${isWide ? 'h-52' : 'h-44'}`}>
                    <img src={img} alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/90 text-gray-700">
                        {course.category?.name || 'General'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {enrolled ? (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-green-500 text-white">Enrolled</span>
                      ) : free ? (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#0078FF] text-white">Free</span>
                      ) : (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#ba9d25] text-white">{price}</span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className={`font-bold text-base mb-1.5 line-clamp-2 group-hover:text-[#ba9d25] transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {course.title}
                    </h3>
                    <p className={`text-sm leading-relaxed line-clamp-2 mb-4 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {course.description || 'No description available'}
                    </p>

                    {/* Meta */}
                    <div className={`flex items-center gap-4 text-xs mb-4 pb-4 border-b ${isDark ? 'border-white/10 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {modules} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {topics} topics
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {enrolled ? <span className="text-green-500 text-sm font-semibold">✓ Enrolled</span> : price}
                      </span>
                      <button
                        onClick={() => handleView(course)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${enrolled
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-[#0078FF] text-white hover:bg-[#ba9d25]'
                          }`}
                      >
                        {enrolled ? 'Continue →' : 'View Details →'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bottom CTA (Light & Sleek) ── */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100 relative overflow-hidden">
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.4]" style={{
          backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        <div className="absolute top-0 left-0 w-64 h-64 bg-[#ba9d25]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-[#0078FF] uppercase tracking-[0.2em] mb-3">Not Sure Which to Pick?</p>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                Talk to our counselors — <span className="text-[#ba9d25]">it's free</span>
              </h3>
              <p className="text-gray-500 text-sm max-w-md">Get a personalized course recommendation based on your goals and current level.</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex-shrink-0 px-8 py-4 bg-[#ba9d25] text-white font-black rounded-2xl text-sm hover:opacity-90 transition-all shadow-lg shadow-yellow-100 flex items-center gap-2"
            >
              Request Free Callback
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomCourses;
