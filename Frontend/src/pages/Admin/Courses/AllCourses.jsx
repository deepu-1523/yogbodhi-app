import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import api from '../../../services/adminendpoint';
import Loader from '../../../components/AdminComponent/Loader';

const RenderHTML = ({ htmlContent, className = "" }) => {
  if (!htmlContent) return null;
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// Helper function to get instructor name from course object
const getInstructorName = (course) => {
  if (!course) return 'N/A';
  // Check for instructorName field first, then instructor.fullName
  if (course.instructorName) return course.instructorName;
  if (course.instructor && course.instructor.fullName) return course.instructor.fullName;
  return 'N/A';
};

const AllCourses = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedChapters, setExpandedChapters] = useState({});
  const [processingId, setProcessingId] = useState(null);

  const GetFullDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(api.fullcourse.getfullcourse);
      console.log(res)
      let coursesData = [];
      if (res.data?.success && res.data?.data) {
        coursesData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      } else if (Array.isArray(res.data)) {
        coursesData = res.data;
      }
      setCourses(coursesData);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || 'Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetFullDetails();
  }, []);

  const updateCourseStatus = async (courseId, status) => {
    if (!courseId) return;
    setProcessingId(courseId);
    try {
      const res = await axios.post(api.fullcourse.approvedCourse, {
        courseId: courseId,
        status: status,
      });
      if (res.data?.success) {
        alert(`Course ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
        await GetFullDetails();
      } else {
        alert(res.data?.message || 'Failed to update status');
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.response?.data?.message || 'Error updating course status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
    setExpandedModules({});
    setExpandedChapters({});
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Approved</span>;
    } else if (status === 'rejected') {
      return <span className="px-2 py-1 bg-yellow-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>;
    } else {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
    }
  };

  if (loading) return <Loader message="Loading Courses..." />;

  if (error) {
    return (
      <div className="px-4 py-6 sm:py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
          <strong>Error:</strong> {error}
          <button
            onClick={GetFullDetails}
            className="ml-3 sm:ml-4 bg-yellow-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded hover:bg-red-700 transition text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Course Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and view all available courses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{courses.length}</div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">Total Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
              {courses.reduce((sum, course) => sum + (course.modules?.length || 0), 0)}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">Total Modules</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">
              {courses.reduce((sum, course) =>
                sum + (course.modules?.reduce((s, m) => s + (m.chapters?.length || 0), 0) || 0), 0)}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">Total Chapters</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
              {courses.reduce((sum, course) =>
                sum + (course.modules?.reduce((s, m) =>
                  s + (m.chapters?.reduce((t, c) => t + (c.topics?.length || 0), 0) || 0), 0) || 0), 0)}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">Total Topics</div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3 sm:space-y-4">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-3 sm:p-4">
                <div className="mb-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex-1">{course.title}</h3>
                    {getStatusBadge(course.status || 'pending')}
                  </div>
                  <RenderHTML
                    htmlContent={course.description}
                    className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                  <span className="px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {course.category?.name || 'N/A'}
                  </span>
                  <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs capitalize ${
                    course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-yellow-100 text-red-800'
                  }`}>
                    {course.level}
                  </span>
                  <span className="px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {course.modules?.length || 0} modules
                  </span>
                </div>

                {/* Instructor Name - Mobile View */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="font-medium">Instructor:</span>
                  <span className="text-gray-700">{getInstructorName(course)}</span>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewDetails(course)}
                      className="bg-blue-50 text-blue-700 border border-blue-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm"
                    >
                      View Details
                    </button>
                    {course.status !== 'approved' && (
                      <button
                        onClick={() => updateCourseStatus(course._id, 'approved')}
                        disabled={processingId === course._id}
                        className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors text-xs disabled:opacity-50"
                      >
                        {processingId === course._id ? 'Processing...' : 'Approve'}
                      </button>
                    )}
                    {course.status !== 'rejected' && (
                      <button
                        onClick={() => updateCourseStatus(course._id, 'rejected')}
                        disabled={processingId === course._id}
                        className="bg-yellow-50 text-red-700 border border-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors text-xs disabled:opacity-50"
                      >
                        {processingId === course._id ? 'Processing...' : 'Reject'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Course Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Instructor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Modules</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Created Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-gray-800">{course.title}</div>
                        <RenderHTML
                          htmlContent={course.description}
                          className="text-xs text-gray-500 mt-1 max-w-md truncate"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {course.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                        course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-yellow-100 text-red-800'
                      }`}>
                        {course.level}
                      </span>
                    </td>
                    {/* Instructor Name - Desktop View */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {getInstructorName(course)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-sm">{course.modules?.length || 0} modules</span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(course.status || 'pending')}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewDetails(course)}
                          className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors text-xs"
                        >
                          View Details
                        </button>
                        {course.status !== 'approved' && (
                          <button
                            onClick={() => updateCourseStatus(course._id, 'approved')}
                            disabled={processingId === course._id}
                            className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors text-xs disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {course.status !== 'rejected' && (
                          <button
                            onClick={() => updateCourseStatus(course._id, 'rejected')}
                            disabled={processingId === course._id}
                            className="bg-yellow-50 text-red-700 border border-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors text-xs disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Course Details */}
        {showModal && selectedCourse && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 sticky top-0 z-10">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 break-words">{selectedCourse.title}</h2>
                    <RenderHTML
                      htmlContent={selectedCourse.description}
                      className="text-blue-100 text-xs sm:text-sm"
                    />
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500 rounded-full text-xs sm:text-sm">
                        {selectedCourse.category?.name || 'Uncategorized'}
                      </span>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        selectedCourse.level === 'beginner' ? 'bg-green-500' :
                        selectedCourse.level === 'intermediate' ? 'bg-yellow-500' : 'bg-yellow-500'
                      }`}>
                        {selectedCourse.level}
                      </span>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500 rounded-full text-xs sm:text-sm">
                        {selectedCourse.modules?.length || 0} Modules
                      </span>
                    </div>
                    {/* Instructor Name - Modal */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 text-blue-100 text-sm">
                      <span className="font-semibold">Instructor:</span>
                      <span>{getInstructorName(selectedCourse)}</span>
                    </div>
                  </div>
                  <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-6">
                {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-4">Course Modules</h3>
                    {selectedCourse.modules.map((module, moduleIndex) => (
                      <div key={module._id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                          onClick={() => toggleModule(module._id)}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm flex-shrink-0">
                              {moduleIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base break-words">{module.title}</h4>
                              <p className="text-xs text-gray-500">{module.chapters?.length || 0} chapters</p>
                            </div>
                          </div>
                          <button className="text-gray-600 hover:text-gray-800 flex-shrink-0 ml-2">
                            <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${expandedModules[module._id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {expandedModules[module._id] && module.chapters && (
                          <div className="border-t border-gray-200">
                            {module.chapters.map((chapter, chapterIndex) => (
                              <div key={chapter._id} className="border-b border-gray-200 last:border-b-0">
                                <div
                                  className="flex items-center justify-between p-3 sm:p-4 pl-8 sm:pl-12 cursor-pointer hover:bg-gray-50"
                                  onClick={() => toggleChapter(chapter._id)}
                                >
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
                                    <span className="text-gray-500 font-medium text-xs sm:text-sm">Ch {chapterIndex + 1}</span>
                                    <span className="text-gray-800 text-sm sm:text-base break-words flex-1">{chapter.title}</span>
                                    <span className="text-xs text-gray-400 flex-shrink-0">{chapter.topics?.length || 0} topics</span>
                                  </div>
                                  <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 transition-transform flex-shrink-0 ml-2 ${expandedChapters[chapter._id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>

                                {expandedChapters[chapter._id] && chapter.topics && (
                                  <div className="pl-8 sm:pl-12 pr-3 sm:pr-4 pb-3 sm:pb-4 space-y-2 sm:space-y-3">
                                    {chapter.topics.map((topic, topicIndex) => (
                                      <div key={topic._id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                                              <span className="text-blue-600 font-medium text-xs sm:text-sm">Topic {topicIndex + 1}</span>
                                              <h5 className="font-semibold text-gray-800 text-sm sm:text-base break-words">{topic.title}</h5>
                                              {topic.isPreviewFree && <span className="px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Free</span>}
                                            </div>
                                            {topic.description && <RenderHTML htmlContent={topic.description} className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3" />}
                                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                              {topic.videoUrl && (
                                                <a href={topic.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-700 text-xs sm:text-sm">
                                                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                  </svg>
                                                  <span>Watch</span>
                                                </a>
                                              )}
                                              {topic.notes && (
                                                <a href={topic.notes} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 sm:gap-2 text-green-600 hover:text-green-700 text-xs sm:text-sm">
                                                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                  </svg>
                                                  <span>Notes</span>
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm sm:text-base">No modules available for this course</div>
                )}
              </div>

              <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50 sticky bottom-0">
                <button onClick={closeModal} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCourses;