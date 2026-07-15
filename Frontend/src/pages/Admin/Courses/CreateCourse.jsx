import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/adminendpoint';

const AdminCourseManager = () => {
  const navigate = useNavigate()
  const [image, setImage] = useState(null);
  const [courseData, setCourseData] = useState({
    title: '',
    discreption: '',
    instructor: '',
    duration: '',
    level: 'Beginner',
    price: '',
    tags: '',
    featured: false,
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData({
      ...courseData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size should be less than 10MB' });
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Only JPEG, JPG, PNG, and GIF files are allowed' });
        return;
      }

      setImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl('');
  };

  const CreateCourse = async (e) => {
    e.preventDefault();

    setMessage({ type: '', text: '' });

    if (!courseData.title.trim()) {
      setMessage({ type: 'error', text: 'Course title is required' });
      return;
    }

    if (!courseData.discreption.trim()) {
      setMessage({ type: 'error', text: 'Course description is required' });
      return;
    }

    if (!courseData.instructor.trim()) {
      setMessage({ type: 'error', text: 'Instructor name is required' });
      return;
    }

    if (!courseData.duration.trim()) {
      setMessage({ type: 'error', text: 'Course duration is required' });
      return;
    }

    if (!courseData.price.trim()) {
      setMessage({ type: 'error', text: 'Course price is required' });
      return;
    }

    if (!image) {
      setMessage({ type: 'error', text: 'Course thumbnail is required' });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Add text fields to FormData
      Object.keys(courseData).forEach((key) => {
        if (key === 'tags') {
          // Convert tags string to array if it contains commas
          const tagsArray = courseData.tags.split(',').map(tag => tag.trim());
          formData.append(key, JSON.stringify(tagsArray));
        } else if (key === 'featured') {
          formData.append(key, courseData[key].toString());
        } else {
          formData.append(key, courseData[key]);
        }
      });

      // Add image file
      formData.append("image", image);

      console.log("Sending course data...");

      const res = await axios.post(
        api.course.createcourse,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(res.data, "Course Created Successfully");
      navigate('/admin/allcourses')
      toast.success("Course Created Successfully")
      setMessage({ type: 'success', text: 'Course created successfully!' });

      // Reset form
      setCourseData({
        title: '',
        discreption: '',
        instructor: '',
        duration: '',
        level: 'Beginner',
        price: '',
        tags: '',
        featured: false,
      });
      setImage(null);
      setPreviewUrl('');

      // Optional: Redirect after 2 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      console.error("Error creating course:", error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">


      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-yellow-100 border border-yellow-400 text-red-700'
            }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Create Course Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Create New Course</h2>
            <p className="text-indigo-100 text-sm">Fill in the details to add a new course</p>
          </div>

          <form className="p-6 space-y-5" onSubmit={CreateCourse}>
            {/* Course Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title <span className="text-yellow-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., Advanced React Development"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-yellow-500">*</span>
              </label>
              <textarea
                name="discreption"
                value={courseData.discreption}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Brief description of the course..."
                disabled={loading}
              />
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor <span className="text-yellow-500">*</span>
              </label>
              <input
                type="text"
                name="instructor"
                value={courseData.instructor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., John Doe"
                disabled={loading}
              />
            </div>

            {/* Duration and Price - Two Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration <span className="text-yellow-500">*</span>
                </label>
                <input
                  type="text"
                  name="duration"
                  value={courseData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g., 10 weeks"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-yellow-500">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={courseData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g., $49.99"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Level and Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  value={courseData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={loading}
                >
                  <option>beginner</option>
                  <option>intermediate</option>
                  <option>advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={courseData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="React, JavaScript, etc. (comma separated)"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail <span className="text-yellow-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="mb-3">
                      <img src={previewUrl} alt="Preview" className="h-40 w-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="mt-2 text-sm text-yellow-600 hover:text-red-800 font-medium"
                        disabled={loading}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            name="image"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={courseData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label className="ml-2 block text-sm text-gray-700">
                Feature this course (show on homepage)
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] font-medium shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Course...
                </div>
              ) : (
                'Create Course'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseManager;