import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Image as ImageIcon, 
  Loader2 as LoaderIcon,
  Star,
  Users
} from 'lucide-react';
import api from '../../services/adminendpoint';
import Loader from '../../components/AdminComponent/Loader';


const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    rating: 5,
    experience: '5+',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await axios.get(api.faculty.get);
      if (response.data.success) {
        setFaculty(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      toast.error('Failed to load faculty list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      description: '',
      rating: 5,
      experience: '5+',
      image: null
    });
    setImagePreview('');
    setIsEditing(false);
    setSelectedMember(null);
  };

  const handleEditClick = (member) => {
    setIsEditing(true);
    setSelectedMember(member);
    setFormData({
      name: member.name,
      subject: member.subject,
      description: member.description,
      rating: member.rating,
      experience: member.experience,
      image: null
    });
    setImagePreview(member.image);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('experience', formData.experience);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      if (isEditing) {
        formDataToSend.append('facultyId', selectedMember._id);
      }

      const url = isEditing ? api.faculty.update : api.faculty.create;
      const response = await axios.post(url, formDataToSend);

      if (response.data.success) {
        toast.success(isEditing ? 'Faculty updated successfully' : 'Faculty added successfully');
        setShowModal(false);
        resetForm();
        fetchFaculty();
      }
    } catch (error) {
      console.error('Error saving faculty:', error);
      toast.error(error.response?.data?.message || 'Failed to save faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      setLoading(true);
      try {
        const response = await axios.post(api.faculty.delete, { facultyId: id });
        if (response.data.success) {
          toast.success('Faculty member deleted successfully');
          fetchFaculty();
        }
      } catch (error) {
        console.error('Error deleting faculty:', error);
        toast.error('Failed to delete faculty member');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && faculty.length === 0) {
    return <Loader message="Loading faculty list..." />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your expert teaching staff</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm gap-2 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map((member) => (
          <div key={member._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEditClick(member)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-yellow-600 hover:bg-yellow-600 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 truncate">{member.name}</h3>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                  {member.subject}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {member.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium text-gray-900">{member.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{member.experience} Exp.</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {faculty.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200 mt-8">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No faculty members found. Add your first member!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Faculty Member' : 'Add New Faculty Member'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject / Department</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Physics, Mathematics"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 10+ Years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                        className="absolute top-1 right-1 p-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                      <Plus className="w-6 h-6 text-gray-400" />
                      <span className="text-[10px] text-gray-400 mt-1">Upload</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : (isEditing ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;
