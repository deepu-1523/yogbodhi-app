import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, ExternalLink, Video, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/endpoints';
import Loader from '../../components/AdminComponent/Loader';

const SuccessStoriesManagement = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    duration: '00:00',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(api.successStory.adminGet);
      if (res.data.success) {
        setStories(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch success stories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStory) {
        const res = await axios.post(api.successStory.update, {
          storyId: editingStory._id,
          ...formData
        });
        if (res.data.success) {
          toast.success('Story updated successfully');
          setIsModalOpen(false);
          fetchStories();
        }
      } else {
        const res = await axios.post(api.successStory.add, formData);
        if (res.data.success) {
          toast.success('Story added successfully');
          setIsModalOpen(false);
          fetchStories();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        const res = await axios.post(api.successStory.delete, { storyId: id });
        if (res.data.success) {
          toast.success('Story deleted successfully');
          fetchStories();
        }
      } catch (error) {
        toast.error('Failed to delete story');
      }
    }
  };

  const openAddModal = () => {
    setEditingStory(null);
    setFormData({
      title: '',
      youtubeUrl: '',
      duration: '00:00',
      order: stories.length,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      youtubeUrl: story.youtubeUrl,
      duration: story.duration,
      order: story.order,
      isActive: story.isActive
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return <Loader message="Loading Success Stories..." />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Success Stories Management</h1>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>Add New Video</span>
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 py-20 text-center">
          <Video className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No stories found</h3>
          <p className="text-gray-500">Start by adding your first student success story.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div key={story._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition">
              <div className="relative aspect-video">
                <img
                  src={story.thumbnailUrl}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-4">
                  <button
                    onClick={() => openEditModal(story)}
                    className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(story._id)}
                    className="p-2 bg-white rounded-full text-yellow-600 hover:bg-yellow-50 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-[10px] rounded">
                  {story.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{story.title}</h3>
                  {!story.isActive && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded uppercase font-bold">Draft</span>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Video size={14} className="mr-1" />
                    <span>YouTube</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-1.5"></span>
                    <span>Order: {story.order}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingStory ? 'Edit Video' : 'Add New Video'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Video Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Success Story: From Average to Topper"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">YouTube URL</label>
                <input
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="15:24"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 select-none">
                  Active (Show on website)
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold flex items-center justify-center space-x-2"
                >
                  <Save size={18} />
                  <span>{editingStory ? 'Update Video' : 'Add Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStoriesManagement;
