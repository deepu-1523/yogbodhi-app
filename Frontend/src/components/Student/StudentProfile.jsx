// StudentProfile.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import api from '../../services/endpoints';
import useStudentStore from '../../Store/studentstore';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    Heart,
    Camera,
    Edit3,
    ChevronRight,
    ArrowLeft,
    ShieldCheck,
    BookOpen,
    Award
} from 'lucide-react';

const StudentProfile = () => {
    const { student, setStudent } = useStudentStore();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [saving, setSaving] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateofBirth: '',
        gender: '',
        currentClass: '',
        interestedCourse: '',
        address: '',
    });

    const getStudentId = () => {
        if (student?._id) return student._id;
        if (student?.user?._id) return student.user._id;
        if (studentData?._id) return studentData._id;

        const storedStudent = localStorage.getItem('student');
        if (storedStudent) {
            try {
                const parsed = JSON.parse(storedStudent);
                return parsed._id || parsed.user?._id;
            } catch (err) {
                console.error("Error parsing localStorage:", err);
            }
        }
        return null;
    };

    const GetStudentData = async () => {
        const studentId = getStudentId();

        if (!studentId) {
            toast.error("Student ID not found. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(api.student.getStudent, {
                studentId: studentId,
            });

            if (res.data.success && res.data.user) {
                setStudentData(res.data.user);
                setFormData({
                    fullName: res.data.user.fullName || '',
                    email: res.data.user.email || '',
                    phone: res.data.user.phone || '',
                    dateofBirth: res.data.user.dateofBirth ? res.data.user.dateofBirth.split('T')[0] : '',
                    gender: res.data.user.gender || '',
                    currentClass: res.data.user.currentClass || '',
                    interestedCourse: res.data.user.interestedCourse || '',
                    address: res.data.user.address || '',
                });

                if (res.data.user.enrolledCourses && Array.isArray(res.data.user.enrolledCourses)) {
                    setEnrolledCourses(res.data.user.enrolledCourses);
                }
            } else {
                toast.error(res.data.message || "Failed to fetch student data");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch student data");
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            uploadProfile(file);
        }
    };

    const uploadProfile = async (file) => {
        const studentId = getStudentId();
        if (!studentId) {
            toast.error('Student ID not found');
            return;
        }

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("studentId", studentId);

            const response = await axios.post(api.student.editProfile, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
           console.log(response)
            if (response.data.success) {
                setStudentData(prev => ({
                    ...prev,
                    profileImage: response.data.updateduser?.profileImage
                }));
                toast.success('Profile image updated successfully!');
                GetStudentData();
            } else {
                toast.error(response.data.message || 'Failed to upload image');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error uploading image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const editDetails = async (e) => {
        e.preventDefault();
        setSaving(true);

        const studentId = getStudentId();
        if (!studentId) {
            toast.error("Student ID not found. Please log in again.");
            setSaving(false);
            return;
        }

        try {
            const dataToSend = {
                studentId: studentId,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone ? Number(formData.phone) : null,
                currentClass: formData.currentClass,
                interestedCourse: formData.interestedCourse,
                address: formData.address,
                dateofBirth: formData.dateofBirth,
                gender: formData.gender,
            };

            const res = await axios.post(api.student.editprofiledetails, dataToSend);

            if (res.data.success) {
                const updatedStudent = res.data.student || res.data.user;
                setStudentData(prev => ({
                    ...prev,
                    ...updatedStudent
                }));
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                GetStudentData();
            } else {
                toast.error(res.data.message || 'Failed to update profile');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (student || getStudentId()) {
            GetStudentData();
        } else {
            toast.error("Please log in to view profile");
            setLoading(false);
        }
    }, [student]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-slate-500 font-bold animate-pulse">Designing your profile...</p>
                </div>
            </div>
        );
    }

    if (!studentData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="max-w-md w-full bg-white p-8 rounded-[32px] shadow-2xl shadow-blue-900/5 text-center">
                    <div className="w-20 h-20 bg-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="text-yellow-500" size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Session Expired</h2>
                    <p className="text-slate-500 font-medium mb-8">We couldn't retrieve your profile data. Please sign in again to access your dashboard.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    const profileImageUrl = studentData.profileImage || studentData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.fullName)}&background=0078FF&color=fff&size=200&bold=true`;

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-poppins pb-20">
            {/* Premium Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <ArrowLeft size={20} className="text-slate-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Roots Classes</h1>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Student Central</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/course')}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10"
                        >
                            Explore Courses
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Hero Profile Section */}
                <section className="relative mb-10">
                    <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[40px] shadow-2xl shadow-blue-600/20 overflow-hidden relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="absolute top-6 right-6">
                            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                ID: {studentData._id?.slice(-8).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="px-6 md:px-12 -mt-20 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
                        <div className="relative group">
                            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[48px] border-8 border-white bg-white shadow-2xl overflow-hidden relative">
                                <img
                                    src={profileImageUrl}
                                    alt={studentData.fullName}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <label
                                    htmlFor="profileImageUpload"
                                    className={`absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer ${uploadingImage ? 'opacity-100' : ''}`}
                                >
                                    {uploadingImage ? (
                                        <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Camera size={28} className="text-white mb-1" />
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest">Update</span>
                                        </div>
                                    )}
                                </label>
                                <input
                                    type="file"
                                    id="profileImageUpload"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    disabled={uploadingImage}
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-8 h-8 rounded-full shadow-lg shadow-green-500/30 animate-pulse"></div>
                        </div>

                        <div className="text-center md:text-left flex-1 pb-4">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                                {studentData.fullName}
                            </h2>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl text-xs font-black uppercase tracking-tight">
                                    <GraduationCap size={14} />
                                    {studentData.currentClass || 'Member'}
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-tight">
                                    <ShieldCheck size={14} />
                                    Verified
                                </div>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
                                >
                                    <Edit3 size={14} />
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <StatBox icon={<BookOpen className="text-blue-600" />} label="Courses" value={enrolledCourses.length} />
                    <StatBox icon={<Award className="text-purple-600" />} label="Class" value={studentData.currentClass || 'N/A'} />
                    <StatBox icon={<Calendar className="text-emerald-600" />} label="Joined" value={new Date(studentData.createdAt).getFullYear()} />
                    <StatBox icon={<Heart className="text-rose-600" />} label="Gender" value={studentData.gender || 'Not set'} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Contact & Personal */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-900/[0.02] border border-slate-50">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900">Personal Information</h3>
                                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <User className="text-blue-600" size={20} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <InfoItem icon={<Mail />} label="Email Address" value={studentData.email} />
                                <InfoItem icon={<Phone />} label="Phone Number" value={studentData.phone ? String(studentData.phone) : 'Not registered'} />
                                <InfoItem icon={<Calendar />} label="Date of Birth" value={studentData.dateofBirth ? new Date(studentData.dateofBirth).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not set'} />
                                <InfoItem icon={<Heart />} label="Gender Identity" value={studentData.gender || 'Not specified'} />
                                <InfoItem icon={<MapPin />} label="Current Address" value={studentData.address || 'No address on file'} className="md:col-span-2" />
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-900/[0.02] border border-slate-50">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900">Academic Trajectory</h3>
                                <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center">
                                    <GraduationCap className="text-purple-600" size={20} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-slate-50 rounded-3xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Academic Level</p>
                                    <p className="text-lg font-black text-slate-800">{studentData.currentClass || 'Not Specified'}</p>
                                </div>
                                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Primary Interest</p>
                                    <p className="text-lg font-black text-blue-900">{studentData.interestedCourse || 'Exploring'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Enrolled Courses Mini List */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-900/[0.02] border border-slate-50 h-full">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900">My Learning</h3>
                                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    {enrolledCourses.length} Active
                                </span>
                            </div>

                            {enrolledCourses.length > 0 ? (
                                <div className="space-y-4">
                                    {enrolledCourses.map((course, idx) => (
                                        <div key={idx} className="group p-4 bg-slate-50 hover:bg-blue-600 rounded-3xl transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-90 transition-transform">
                                                    <BookOpen className="text-blue-600" size={20} />
                                                </div>

                                                <Link to="/purchescourse">
                                                    <div className="flex-1">
                                                        <p className="text-xs font-black text-slate-900 group-hover:text-white line-clamp-1">
                                                            {course.title || 'Course ' + (idx + 1)}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-200">Enrolled</p>
                                                    </div>
                                                </Link>
                                                <ChevronRight size={16} className="text-slate-300 group-hover:text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="text-slate-300" size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400">No courses yet</p>
                                    <button onClick={() => navigate('/course')} className="mt-4 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
                                        Start Learning
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Premium Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-fadeIn">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-slideUp">
                        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Edit Profile</h3>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                                <ArrowLeft size={20} className="text-slate-600" />
                            </button>
                        </div>

                        <form onSubmit={editDetails} className="p-8 md:p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} icon={<User size={16} />} />
                                <FormInput label="Email Address" name="email" value={formData.email} onChange={handleInputChange} icon={<Mail size={16} />} type="email" />
                                <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} icon={<Phone size={16} />} type="tel" maxLength="10" />
                                <FormInput label="Current Class" name="currentClass" value={formData.currentClass} onChange={handleInputChange} icon={<GraduationCap size={16} />} />
                                <FormInput label="Interested Course" name="interestedCourse" value={formData.interestedCourse} onChange={handleInputChange} icon={<BookOpen size={16} />} />
                                <FormInput label="Date of Birth" name="dateofBirth" value={formData.dateofBirth} onChange={handleInputChange} icon={<Calendar size={16} />} type="date" />

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender Identity</label>
                                    <div className="relative">
                                        <Heart size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600/20 outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600/20 outline-none resize-none"
                                        placeholder="Enter your current residential address..."
                                    />
                                </div>
                            </div>
                        </form>

                        <div className="p-8 bg-slate-50 flex gap-4">
                            <button
                                type="submit"
                                onClick={editDetails}
                                disabled={saving}
                                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                {saving ? 'Updating...' : 'Apply Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-8 py-4 bg-white text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
                .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

const StatBox = ({ icon, label, value }) => (
    <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-900/[0.02] border border-slate-50 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-2">
            {icon}
        </div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-base font-black text-slate-900 mt-0.5">{value}</p>
    </div>
);

const InfoItem = ({ icon, label, value, className = "" }) => (
    <div className={`flex items-start gap-4 ${className}`}>
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-700 break-words">{value || 'Not provided'}</p>
        </div>
    </div>
);

const FormInput = ({ label, name, value, onChange, icon, type = "text", maxLength, placeholder }) => (
    <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {icon}
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                placeholder={placeholder}
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600/20 outline-none placeholder:text-slate-300"
            />
        </div>
    </div>
);

export default StudentProfile;
