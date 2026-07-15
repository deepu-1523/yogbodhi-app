import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../services/instructorendpoint';
import { toast } from 'react-toastify';
import useStudentStore from '../../../Store/studentstore';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Plus, Edit2, Trash2, ChevronRight, Search, X, 
  Layers, Users, Star, IndianRupee, Filter, LayoutGrid, List,
  MoreVertical, Clock, CheckCircle
} from 'lucide-react';

const LEVELS = ['beginner', 'intermediate', 'advanced'];

const AllCourse = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const navigate = useNavigate();
  const { student, token } = useStudentStore();

  const [formData, setFormData] = useState({ title: '', description: '', category: '', level: 'beginner', price: '' });

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.post(api.course.getCourse);
      const data = res.data.data || res.data || [];
      setCourses(data.map(c => ({ ...c, price: c.price ?? 0 })));
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.post(api.course.getCategory);
      setCategories(res.data.data || res.data || []);
    } catch {
      setCategories([]);
    }
  };

  const openCreate = () => {
    setEditingCourse(null);
    setFormData({ title: '', description: '', category: '', level: 'beginner', price: '' });
    setIsModalOpen(true);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category?._id || course.category,
      level: course.level || 'beginner',
      price: course.price,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = { ...formData, price: Number(formData.price) };
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingCourse) {
        await axios.post(api.course.editCourse, { courseId: editingCourse._id, ...payload }, config);
        toast.success('Course updated successfully');
      } else {
        await axios.post(api.course.createCourse, payload, config);
        toast.success('Course created successfully');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.post(api.course.deleteCourse, { courseId: id }, config);
      toast.success('Course deleted');
      fetchCourses();
    } catch {
      toast.error('Failed to delete course');
    }
  };

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const getLevelStyles = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500' };
      case 'intermediate':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', dot: 'bg-amber-500' };
      case 'advanced':
        return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', dot: 'bg-rose-500' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100', dot: 'bg-slate-500' };
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={color.replace('bg-', 'text-')} size={22} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Course Management</h1>
            <p className="text-gray-500 mt-1 font-medium">Create, edit, and monitor your educational content</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard title="Total Courses" value={courses.length} icon={BookOpen} color="bg-blue-600" />
          <StatCard title="Total Students" value="1,240" icon={Users} color="bg-indigo-600" />
          <StatCard title="Average Rating" value="4.8" icon={Star} color="bg-amber-500" />
          <StatCard title="Total Revenue" value="₹12.5k" icon={IndianRupee} color="bg-emerald-600" />
        </div>

        {/* Filters & Actions Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by course title or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors w-full md:w-auto justify-center">
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="text-gray-500 font-medium animate-pulse">Loading your courses...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={40} className="text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No courses found</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
              {search ? `No results for "${search}". Try a different keyword.` : "You haven't created any courses yet. Start sharing your knowledge today!"}
            </p>
            {!search && (
              <button
                onClick={openCreate}
                className="mt-8 inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
              >
                <Plus size={20} />
                <span>Add your first course</span>
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {filtered.map((course) => {
               const style = getLevelStyles(course.level);
               return (
                 <div key={course._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                    <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                       <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${style.bg} ${style.text} backdrop-blur-md bg-opacity-90`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                            {course.level || 'Beginner'}
                          </span>
                       </div>
                       <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                          <BookOpen size={120} className="text-white" />
                       </div>
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button onClick={() => openEdit(course)} className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-colors"><Edit2 size={20} /></button>
                          <button onClick={() => handleDelete(course._id)} className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-rose-500/40 transition-colors"><Trash2 size={20} /></button>
                       </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                            {categories.find(c => c._id === (course.category?._id || course.category))?.name || 'General'}
                          </p>
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{course.title}</h4>
                          <p className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1">
                            <Users size={12} className="text-gray-300" />
                            {course.instructor?.fullName || (course.instructorName !== "Instructor Name Not Available" ? course.instructorName : "Instructor")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{course.price ? `₹${course.price}` : 'Free'}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed flex-1">{course.description}</p>
                      
                      <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="student" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                          <span className="text-xs font-medium text-gray-400">+124 students</span>
                        </div>
                        <button 
                          onClick={() => navigate(`/instructor/courses/${course._id}`)}
                          className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Manage <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                 </div>
               )
             })}
          </div>
        ) : (
          /* Enhanced Desktop Table View */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course Detail</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category & Level</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pricing</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((course) => {
                    const style = getLevelStyles(course.level);
                    return (
                      <tr key={course._id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold group-hover:scale-110 transition-transform">
                              <BookOpen size={20} />
                            </div>
                            <div className="max-w-xs">
                               <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{course.title}</p>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-gray-400 line-clamp-1">{course.description}</p>
                                <p className="text-[10px] font-semibold text-indigo-500 flex items-center gap-1">
                                  <Users size={10} />
                                  {course.instructor?.fullName || (course.instructorName !== "Instructor Name Not Available" ? course.instructorName : "Instructor")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-gray-600">
                              {categories.find(c => c._id === (course.category?._id || course.category))?.name || '—'}
                            </p>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text} border ${style.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                              {course.level || 'Beginner'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                            <CheckCircle size={10} />
                            Published
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-gray-900">
                            {course.price ? `₹${course.price}` : <span className="text-emerald-600">Free</span>}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/instructor/courses/${course._id}`)}
                              className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                            >
                              Manage
                            </button>
                            <div className="h-6 w-[1px] bg-gray-100 mx-1"></div>
                            <button
                              onClick={() => openEdit(course)}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit Course"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(course._id)}
                              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Course"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enhanced Mobile Card View */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filtered.map((course) => {
              const style = getLevelStyles(course.level);
              return (
                <div key={course._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <BookOpen size={18} />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{course.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                            {categories.find(c => c._id === (course.category?._id || course.category))?.name || 'General'}
                          </p>
                          <span className="text-gray-300">•</span>
                          <p className="text-[10px] font-medium text-gray-400 italic">
                            By {course.instructor?.fullName || (course.instructorName !== "Instructor Name Not Available" ? course.instructorName : "Instructor")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${style.bg} ${style.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                      {course.level || 'Beginner'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{course.price ? `₹${course.price}` : 'Free'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(course)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(course._id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                      <button 
                        onClick={() => navigate(`/instructor/courses/${course._id}`)}
                        className="ml-1 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modern Modal Design */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
            onClick={() => setIsModalOpen(false)} 
          />
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-indigo-900/10 overflow-hidden relative z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-gray-50/30">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  {editingCourse ? 'Update Course Details' : 'Design New Course'}
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">Fill in the essential details for your course</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Master React.js & Modern Web Development"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Brief Description</label>
                  <textarea
                    rows="3"
                    required
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Provide a compelling overview of what students will learn..."
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Category</label>
                    <div className="relative">
                      <select
                        required
                        value={formData.category}
                        onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3.5 px-5 text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                      <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Target Level</label>
                    <div className="relative">
                      <select
                        required
                        value={formData.level}
                        onChange={e => setFormData(p => ({ ...p, level: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3.5 px-5 text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium"
                      >
                        {LEVELS.map(l => (
                          <option key={l} value={l} className="capitalize">{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                        ))}
                      </select>
                      <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Course Price (INR)</label>
                  <div className="relative">
                    <IndianRupee size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                      placeholder="0 for Free Courses"
                      min="0"
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-[2] py-4 text-sm font-bold text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-60 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>{editingCourse ? 'Update Course' : 'Create Course'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCourse;

