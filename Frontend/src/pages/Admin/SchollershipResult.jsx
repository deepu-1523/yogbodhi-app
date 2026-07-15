import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../services/adminendpoint';
import Loader from '../../components/AdminComponent/Loader';

// Simple Toast Component (can be replaced with a library like react-toastify)
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-yellow-500' : 'bg-blue-500';
  return (
    <div className={`fixed top-5 right-5 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300`}>
      {message}
    </div>
  );
};

const ScholarshipResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  // Scholarship modal state
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [scholarshipForm, setScholarshipForm] = useState({
    discount: 50,
    validFrom: '',
    validUntil: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Helper: format test score
  const getTestScoreDisplay = (obtainedMarks, totalMarks) => {
    const obtained = obtainedMarks ?? 0;
    const total = totalMarks ?? 0;
    if (total === 0 && obtained === 0) return 'Test not attempted';
    return `${obtained} / ${total}`;
  };

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const scholarshipResponse = await axios.get(api.schollership.schollershipResult);
      const pendingApplications = scholarshipResponse.data?.data || [];

      const approvedRejectedResponse = await axios.get(api.schollership.getApprovedReject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const approvedRejectedApplications = approvedRejectedResponse.data?.data || [];

      // Merge logic (same as yours)
      const scholarshipMap = new Map();
      approvedRejectedApplications.forEach(item => {
        if (item._id) scholarshipMap.set(item._id, item);
      });

      const mergedResults = pendingApplications.map(app => {
        const existing = scholarshipMap.get(app.scholarshipId || app._id);
        if (existing) {
          return { ...app, ...existing, isProcessed: true, scholarshipId: app.scholarshipId || app._id };
        }
        return { ...app, status: 'pending', isProcessed: false, scholarshipId: app.scholarshipId || app._id };
      });

      approvedRejectedApplications.forEach(item => {
        if (!mergedResults.some(r => r.scholarshipId === item._id)) {
          mergedResults.push({
            _id: item._id,
            scholarshipId: item._id,
            status: item.status,
            studentId: item.studentId,
            testId: { title: 'N/A' },
            obtainedMarks: 0,
            totalMarks: 0,
            percentage: 0,
            isEligible: item.status === 'approved',
            isProcessed: true,
            discount: item.discount,
            validFrom: item.validFrom,
            validUntil: item.validUntil
          });
        }
      });

      setResults(mergedResults);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to load scholarship results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const openScholarshipModal = (student) => {
    const today = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    setSelectedStudent(student);
    setScholarshipForm({
      discount: 50,
      validFrom: formatDate(today),
      validUntil: formatDate(oneYearLater)
    });
    setFormErrors({});
    setShowScholarshipModal(true);
  };

  const validateForm = () => {
    const errors = {};
    const fromDate = new Date(scholarshipForm.validFrom);
    const untilDate = new Date(scholarshipForm.validUntil);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!scholarshipForm.validFrom) errors.validFrom = 'Start date required';
    if (!scholarshipForm.validUntil) errors.validUntil = 'End date required';
    if (fromDate < today) errors.validFrom = 'Start date cannot be in the past';
    if (untilDate <= fromDate) errors.validUntil = 'End date must be after start date';
    if (scholarshipForm.discount < 0 || scholarshipForm.discount > 100)
      errors.discount = 'Discount must be between 0 and 100';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const grantScholarship = async () => {
    if (!validateForm()) return;

    try {
      setActionLoading(selectedStudent?._id);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required.');

      const scholarshipId = selectedStudent.scholarshipId || selectedStudent._id;
      const requestData = {
        scholarshipId,
        discount: scholarshipForm.discount,
        validFrom: scholarshipForm.validFrom,
        validUntil: scholarshipForm.validUntil
      };

      const response = await axios.post(api.schollership.grantScholarship, requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.success !== false) {
        // Update local state
        setResults(prev =>
          prev.map(r =>
            r.scholarshipId === scholarshipId
              ? { ...r, status: 'approved', isProcessed: true, discount: scholarshipForm.discount, validFrom: scholarshipForm.validFrom, validUntil: scholarshipForm.validUntil }
              : r
          )
        );
        showToast(`✅ Scholarship granted & email sent to ${selectedStudent.studentId?.fullName}!`, 'success');
        setShowScholarshipModal(false);
        await fetchAllData(); // refresh to sync
      } else {
        throw new Error(response.data?.message || 'Grant failed');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.message || 'Failed to grant scholarship';
      showToast(`❌ Error: ${msg}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const rejectScholarship = async (student) => {
    if (!window.confirm(`❌ Reject scholarship for ${student.studentId?.fullName}? Email will be sent to student.`)) return;

    try {
      setActionLoading(student._id);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required.');

      const scholarshipId = student.scholarshipId || student._id;
      const requestData = { scholarshipId, remark: 'Does not meet eligibility criteria' };

      const response = await axios.post(api.schollership.rejectScholarship, requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.success !== false) {
        setResults(prev =>
          prev.map(r =>
            r.scholarshipId === scholarshipId ? { ...r, status: 'rejected', isProcessed: true } : r
          )
        );
        showToast(`❌ Scholarship rejected & email sent to ${student.studentId?.fullName}`, 'success');
        await fetchAllData();
      } else {
        throw new Error(response.data?.message || 'Rejection failed');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to reject scholarship';
      showToast(`❌ Error: ${msg}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Status badge (unchanged, but add email hint)
  const getStatusBadge = (result) => {
    if (result.status === 'approved') {
      return (
        <div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✅ Approved</span>
          {result.validUntil && <p className="text-xs text-gray-500 mt-1">Valid until: {new Date(result.validUntil).toLocaleDateString()}</p>}
          <p className="text-xs text-blue-500 mt-0.5">📧 Email sent</p>
        </div>
      );
    }
    if (result.status === 'rejected') {
      return (
        <div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-red-800">❌ Rejected</span>
          <p className="text-xs text-blue-500 mt-0.5">📧 Email sent</p>
        </div>
      );
    }
    if (result.status === 'pending' && result.isEligible) {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">⏳ Pending Approval</span>;
    }
    return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Not Eligible</span>;
  };

  // Filter and stats (same as yours, shortened for brevity)
  const filteredResults = results.filter(result => {
    const matchesSearch = (result.studentId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId?.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' ? true : result.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: results.length,
    approved: results.filter(r => r.status === 'approved').length,
    rejected: results.filter(r => r.status === 'rejected').length,
    pending: results.filter(r => r.status === 'pending' && r.isEligible).length
  };

  if (loading) return <Loader message="Loading Scholarship Data..." />;
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-yellow-50 p-6 rounded shadow text-yellow-600">{error} <button onClick={fetchAllData} className="ml-4 underline">Retry</button></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Scholarship Management</h1>
        <p className="text-gray-600 mb-6">Review, approve/reject – emails sent automatically to students.</p>

        {/* Stats Cards (same structure, just reuse stats) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded shadow p-6"><div className="flex justify-between"><div><p className="text-gray-500">Total</p><p className="text-2xl font-bold">{stats.total}</p></div><div className="bg-blue-100 p-3 rounded-full">📄</div></div></div>
          <div className="bg-white rounded shadow p-6"><div className="flex justify-between"><div><p className="text-gray-500">Approved</p><p className="text-2xl font-bold text-green-600">{stats.approved}</p></div><div className="bg-green-100 p-3 rounded-full">✅</div></div></div>
          <div className="bg-white rounded shadow p-6"><div className="flex justify-between"><div><p className="text-gray-500">Rejected</p><p className="text-2xl font-bold text-yellow-600">{stats.rejected}</p></div><div className="bg-yellow-100 p-3 rounded-full">❌</div></div></div>
          <div className="bg-white rounded shadow p-6"><div className="flex justify-between"><div><p className="text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></div><div className="bg-yellow-100 p-3 rounded-full">⏳</div></div></div>
        </div>

        {/* Search & Filter (unchanged) */}
        <div className="bg-white rounded shadow p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <input type="text" placeholder="🔍 Search student..." className="flex-1 border rounded px-4 py-2" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded ${filterStatus === status ? (status === 'approved' ? 'bg-green-600 text-white' : status === 'rejected' ? 'bg-yellow-600 text-white' : status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white') : 'bg-gray-100'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</button>
            ))}
          </div>
        </div>

        {/* Table (only actions modified to show "Email sent" hint, but already in badge) */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left">S.No</th><th>Student</th><th>Email</th><th>Test Score</th><th>Percentage</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredResults.map((result, idx) => (
                <tr key={result._id || result.scholarshipId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{idx+1}</td>
                  <td className="px-6 py-4 font-medium">{result.studentId?.fullName || 'N/A'}</td>
                  <td className="px-6 py-4">{result.studentId?.email || 'N/A'}</td>
                  <td className="px-6 py-4">{getTestScoreDisplay(result.obtainedMarks, result.totalMarks)}</td>
                  <td className="px-6 py-4">{result.percentage || 0}%</td>
                  <td className="px-6 py-4">{getStatusBadge(result)}</td>
                  <td className="px-6 py-4">
                    {result.status === 'pending' && result.isEligible && !result.isProcessed ? (
                      <div className="flex gap-2">
                        <button onClick={() => openScholarshipModal(result)} disabled={actionLoading === result._id} className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">✅ Grant</button>
                        <button onClick={() => rejectScholarship(result)} disabled={actionLoading === result._id} className="px-3 py-1 bg-yellow-600 text-white rounded disabled:opacity-50">❌ Reject</button>
                      </div>
                    ) : result.status === 'approved' ? (
                      <span className="text-green-600 text-sm">{result.discount || 50}% Discount</span>
                    ) : result.status === 'rejected' ? (
                      <span className="text-yellow-600 text-sm">Rejected</span>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showScholarshipModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Grant Scholarship</h2>
                <p className="text-sm text-gray-600">{selectedStudent.studentId?.fullName}</p>
              </div>
              <div className="p-6 space-y-4">
                <div><label>Discount (%)</label><input type="number" min="0" max="100" value={scholarshipForm.discount} onChange={e => setScholarshipForm({...scholarshipForm, discount: +e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                <div><label>Valid From</label><input type="date" value={scholarshipForm.validFrom} onChange={e => setScholarshipForm({...scholarshipForm, validFrom: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                <div><label>Valid Until</label><input type="date" value={scholarshipForm.validUntil} onChange={e => setScholarshipForm({...scholarshipForm, validUntil: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                {formErrors.discount && <p className="text-yellow-500 text-sm">{formErrors.discount}</p>}
                {formErrors.validFrom && <p className="text-yellow-500 text-sm">{formErrors.validFrom}</p>}
                {formErrors.validUntil && <p className="text-yellow-500 text-sm">{formErrors.validUntil}</p>}
                <div className="bg-blue-50 p-3 rounded text-sm">ℹ️ Student will receive an email with these scholarship details.</div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setShowScholarshipModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button onClick={grantScholarship} disabled={actionLoading === selectedStudent._id} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50">Grant & Send Email</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipResult;