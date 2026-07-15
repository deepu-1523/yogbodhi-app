import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import api from '../../../services/adminendpoint';
import Loader from '../../../components/AdminComponent/Loader';

const AllStudent = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const GetAllStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.post(api.admin.getStudents);
      console.log(response, "All the student details fetched successfully");
      
      if (response.data && response.data.data) {
        setStudents(response.data.data);
      } else if (response.data && response.data.data && response.data.data.data) {
        setStudents(response.data.data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.log(error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetAllStudents();
  }, []);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const getClassColor = (className) => {
    const colors = {
      "12th": "bg-emerald-100 text-emerald-800",
      "11th": "bg-blue-100 text-blue-800",
      "10th": "bg-amber-100 text-amber-800",
      "9th": "bg-purple-100 text-purple-800",
    };
    return colors[className] || "bg-gray-100 text-gray-800";
  };

  const getAvatar = (student) => {
    if (student.profileImage) {
      return student.profileImage;
    }
    const name = student.fullName;
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8', 'F7B05E'];
    const randomColor = colors[name?.length % colors.length];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${randomColor}&color=fff&size=128&bold=true&length=2`;
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.fullName?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.currentClass?.toLowerCase().includes(searchLower) ||
      student.phone?.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loader message="Loading Students..." />;
  }

  return (
    <div className="min-h-screen bg-[#f8faff] bg-line-grid font-poppins">
      {/* Header Section - Pro & Minimal */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#ba9d25]" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Student Directory</p>
                 </div>
                 <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                    Roster Management
                 </h1>
                 <p className="text-[13px] font-bold text-gray-400 uppercase tracking-tight mt-2">Oversee and monitor all registered students across sectors.</p>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="relative flex-1 md:w-80">
                    <input
                      type="text"
                      placeholder="Filter by name, email or class..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all shadow-xl shadow-blue-900/5 placeholder:text-gray-300"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Students Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-[24px] md:rounded-[40px] border border-gray-100 p-8 md:p-24 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-gray-300">
               <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">No students found</h2>
            <p className="text-[13px] font-bold text-gray-400 mb-8 max-w-sm mx-auto">Try adjusting your filters or sectors to find the student records.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Mobile Card View (Small Screens) */}
            <div className="block md:hidden space-y-4">
              {currentStudents.map((student, idx) => (
                <div key={student._id} className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-lg shadow-blue-900/5 relative">
                  <span className="absolute top-5 right-5 text-[10px] font-black text-gray-300">#{(indexOfFirstItem + idx + 1).toString().padStart(2, '0')}</span>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="relative">
                        <img
                           className="h-14 w-14 rounded-2xl object-cover ring-2 ring-gray-50 shadow-sm"
                           src={getAvatar(student)}
                           alt={student.fullName}
                        />
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
                     </div>
                     <div className="pr-8">
                        <h3 className="text-[15px] font-black text-gray-900 tracking-tight leading-none mb-1.5">{student.fullName}</h3>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight line-clamp-1">{student.email}</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                     <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Sector</p>
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${getClassColor(student.currentClass)}`}>
                           {student.currentClass}
                        </span>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Interest</p>
                        <span className="text-[11px] font-black text-[#0078FF] uppercase tracking-tight truncate block">{student.interestedCourse || 'General'}</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Active</span>
                     </div>
                     <button 
                       onClick={() => handleViewDetails(student)}
                       className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-[#0078FF] rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                     >
                        View Profile
                     </button>
                  </div>
                </div>
              ))}
            </div>

            {/* High-End Pro Data Grid (Tablet/Desktop) */}
            <div className="hidden md:block bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-2xl shadow-blue-900/5">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-gray-50">
                           <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">S.No</th>
                           <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Identity</th>
                           <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sector / Class</th>
                           <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gender</th>
                           <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Interest</th>
                           <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                          
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {currentStudents.map((student, idx) => (
                           <tr key={student._id} className="group hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-6">
                                 <span className="text-[11px] font-black text-gray-300">{(indexOfFirstItem + idx + 1).toString().padStart(2, '0')}</span>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="relative">
                                       <img
                                          className="h-11 w-11 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                                          src={getAvatar(student)}
                                          alt={student.fullName}
                                       />
                                       <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                                    </div>
                                    <div>
                                       <h3 className="text-[14px] font-black text-gray-900 tracking-tight leading-none mb-1.5">{student.fullName}</h3>
                                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{student.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getClassColor(student.currentClass)}`}>
                                    {student.currentClass}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="text-[11px] font-black text-gray-500 uppercase tracking-tight">{student.gender || 'N/A'}</span>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="text-[11px] font-black text-[#0078FF] uppercase tracking-tight">{student.interestedCourse || 'General'}</span>
                              </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center justify-between gap-2">
                                     <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Active</span>
                                     </div>
                                     <button 
                                       onClick={() => handleViewDetails(student)}
                                       className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-[#0078FF] rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                                     >
                                        View
                                     </button>
                                  </div>
                               </td>
                             
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Pagination - Bespoke LMS Style */}
            {filteredStudents.length > itemsPerPage && (
               <div className="flex items-center justify-between px-4">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                     Showing {indexOfFirstItem + 1}—{Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} Students
                  </p>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#0078FF] disabled:opacity-30 transition-all shadow-sm"
                     >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                     </button>
                     <button 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#0078FF] disabled:opacity-30 transition-all shadow-sm"
                     >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                     </button>
                  </div>
               </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Student Details - High End */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-[#0a1628]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn" onClick={closeModal}>
          <div className="bg-white rounded-[24px] md:rounded-[40px] max-w-2xl w-full overflow-hidden shadow-2xl animate-slideUp max-h-[95vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="relative p-6 md:p-10 border-b border-gray-50">
               <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8">
                  <img 
                    src={getAvatar(selectedStudent)} 
                    alt={selectedStudent.fullName}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-[32px] object-cover ring-4 ring-gray-50 shadow-xl"
                  />
                  <div className="pr-8 sm:pr-0">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Profile Overview</p>
                     </div>
                     <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">{selectedStudent.fullName}</h2>
                     <p className="text-[11px] font-black text-[#0078FF] uppercase tracking-widest">{selectedStudent.currentClass} Sector</p>
                  </div>
               </div>
               <button onClick={closeModal} className="absolute top-6 right-6 md:top-8 md:right-8 text-gray-300 hover:text-[#ba9d25] transition-colors bg-gray-50 rounded-full p-2"><Plus size={20} className="rotate-45" /></button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-10 space-y-8 md:space-y-10">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Contact Intelligence</p>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                           <p className="text-[13px] font-bold text-gray-700">{selectedStudent.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>
                           <p className="text-[13px] font-bold text-gray-700">{selectedStudent.phone || 'No Registry'}</p>
                        </div>
                     </div>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Academic Status</p>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /></svg></div>
                           <p className="text-[13px] font-bold text-gray-700 capitalize">{selectedStudent.interestedCourse || 'General Curriculum'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                           <p className="text-[13px] font-bold text-gray-700">{selectedStudent.dateofBirth ? new Date(selectedStudent.dateofBirth).toLocaleDateString() : 'N/A'}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-gray-50/50 flex justify-end">
              <button
                onClick={closeModal}
                className="px-10 py-4 bg-[#0a1628] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#ba9d25] transition-all shadow-lg shadow-gray-200"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStudent;