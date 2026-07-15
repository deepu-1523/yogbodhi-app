import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../services/endpoints';
import { BookOpen, Calendar, User, ArrowRight, X, Search, Clock, ChevronRight } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getExcerpt = (content, maxLength = 120) => {
  if (!content) return 'No content available';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

const BlogCard = ({ blog, onClick }) => (
  <div
    onClick={() => onClick(blog)}
    className="group cursor-pointer bg-white rounded-2xl border border-gray-100 hover:border-[#0078FF]/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col"
  >
    <div className="relative h-52 overflow-hidden rounded-t-2xl">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format"; }}
      />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-gray-900 uppercase tracking-wider shadow-sm border border-gray-100">
          {blog.category || 'Education'}
        </span>
      </div>
    </div>

    <div className="p-6 flex flex-col flex-1">
      <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#ba9d25]" /> {formatDate(blog.createdAt)}</span>
        <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#0078FF]" /> 5 min read</span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#0078FF] transition-colors line-clamp-2 leading-snug">
        {blog.title}
      </h3>

      <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed flex-1">
        {getExcerpt(blog.content)}
      </p>

      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-900 flex items-center gap-1 group-hover:gap-2 transition-all">
          Read Article <ChevronRight size={14} className="text-[#ba9d25]" />
        </span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <User size={12} />
          </div>
          <span className="text-[10px] font-bold text-gray-400">{blog.author || 'Root Faculty'}</span>
        </div>
      </div>
    </div>
  </div>
);

const BlogDetail = ({ blog, onClose }) => {
  if (!blog) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-slideUp">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ba9d25]" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Root Insights</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar">
          <div className="h-64 md:h-96 w-full relative">
            <img src={blog.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>

          <div className="px-6 md:px-16 py-10">
            <div className="flex items-center gap-6 mb-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span className="px-3 py-1 bg-yellow-50 text-[#ba9d25] rounded-lg">{blog.category || 'Education'}</span>
              <span>{formatDate(blog.createdAt)}</span>
              <span>By {blog.author || 'Root Faculty'}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {blog.title}
            </h1>

            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6 pb-20">
              {blog.content.split('\n').map((p, i) => p ? <p key={i}>{p}</p> : <br key={i} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Exam Prep', 'Success Stories', 'Updates', 'Study Tips'];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.post(api.blog.getblog);
        const data = res.data?.data?.data || res.data?.data || res.data || [];
        setBlogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'All' || b.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gray-200 border-t-[#0078FF] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Refined Header */}
      <section className="bg-gray-50 border-b border-gray-100 pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-bold text-[#ba9d25] uppercase tracking-[0.3em] mb-4">The Roots Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Expert Insights & <span className="text-[#0078FF]">Guidance</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            Stay updated with the latest in competitive exams, effective study techniques, and success stories from our top performers.
          </p>

          <div className="max-w-lg mx-auto relative group">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0078FF]" size={18} />
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <div className="sticky top-[91px] z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-4 whitespace-nowrap">Topic:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat
                  ? 'bg-[#0078FF] text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, idx) => (
              <BlogCard key={blog._id || idx} blog={blog} onClick={(b) => { setSelectedBlog(b); document.body.style.overflow = 'hidden'; }} />
            ))}
          </div>
        )}
      </main>

      {/* Footer CTA — Light & Sleek */}
      <section className="bg-dot-grid py-24 px-4">
        <div className="max-w-4xl mx-auto bg-[#F8F9FA] rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden border border-yellow-100 shadow-sm">

          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 relative z-10">Don't miss a beat.</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm relative z-10 font-medium">Subscribe to our newsletter and get expert exam tips delivered straight to your inbox.</p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
            <input type="email" placeholder="Enter your email" className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all" />
            <button className="bg-[#0078FF] text-white px-8 py-4 rounded-2xl text-sm font-bold hover:bg-[#0066DD] transition shadow-lg shadow-blue-500/10">Subscribe</button>
          </div>
        </div>
      </section>

      {selectedBlog && <BlogDetail blog={selectedBlog} onClose={() => { setSelectedBlog(null); document.body.style.overflow = 'auto'; }} />}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Blog;