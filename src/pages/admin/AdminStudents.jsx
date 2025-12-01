import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AcademicCapIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon, 
  QrCodeIcon, 
  EyeIcon 
} from "@heroicons/react/24/solid";

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/students');
      const data = await response.json();
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  // Filter K-3 students (created by admin)
  const k3Students = students.filter(s => 
    ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3'].includes(s.gradeLevel)
  );

  // Filter Grade 4-6 students (pending verification)
  const pendingStudents = students.filter(s => 
    ['Grade 4', 'Grade 5', 'Grade 6'].includes(s.gradeLevel) && s.status === 'Pending'
  );

  // VIEW QR CODE
  const handleViewQR = (student) => {
    setSelectedStudent(student);
    setShowQRModal(true);
  };

  // EDIT STUDENT
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({ ...student });
    setShowEditModal(true);
  };

  const handleUpdateStudent = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        alert('✅ Student updated successfully!');
        fetchStudents(); // Refresh list
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('❌ Failed to update student');
    }
  };

  // DELETE STUDENT
  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/students/${studentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('✅ Student deleted successfully!');
        fetchStudents(); // Refresh list
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('❌ Failed to delete student');
    }
  };

  // VIEW DETAILS
  const handleView = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  // DOWNLOAD QR CODE
  const handleDownloadQR = (student) => {
    const link = document.createElement('a');
    link.href = student.qrCode;
    link.download = `QR_${student.lrn}_${student.fullName}.png`;
    link.click();
  };

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <AcademicCapIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Students Management</h2>
        </div>
      </div>

      <p className="text-gray-600">
        Manage student records, verify accounts, and generate QR codes.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Total Students</h3>
          <p className="text-2xl font-bold">{students.length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Pending Verification</h3>
          <p className="text-2xl font-bold">{pendingStudents.length}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-red-800 mb-2">Student Actions</h3>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          <li>Create accounts for Kinder–Grade 3</li>
          <li>Verify Grade 4–6 student self-registration</li>
          <li>Edit student details</li>
          <li>Delete student accounts</li>
          <li>Regenerate or download QR codes</li>
        </ul>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate("/admin/admin/create-k3")}
          className="bg-red-800 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
        >
          + Create Kinder–Grade 3 Account
        </button>
      </div>

      {/* KINDER TO GRADE 3 STUDENTS TABLE */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-red-800 mb-4">
          Kinder to Grade 3 Students (Admin Created) - {k3Students.length} students
        </h3>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead className="bg-red-100 text-red-800">
              <tr>
                <th className="p-3 border">LRN</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Sex</th>
                <th className="p-3 border">Grade</th>
                <th className="p-3 border">Section</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">QR</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    Loading students...
                  </td>
                </tr>
              ) : k3Students.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    No students found. Create your first student account!
                  </td>
                </tr>
              ) : (
                k3Students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{student.lrn}</td>
                    <td className="p-3 border font-semibold">{student.fullName}</td>
                    <td className="p-3 border">{student.sex}</td>
                    <td className="p-3 border">{student.gradeLevel}</td>
                    <td className="p-3 border">{student.section}</td>
                    <td className="p-3 border">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {student.status}
                      </span>
                    </td>
                    <td className="p-3 border">
                      <button 
                        onClick={() => handleViewQR(student)}
                        className="p-2 bg-gray-700 text-white rounded-lg hover:bg-black flex items-center gap-1"
                      >
                        <QrCodeIcon className="w-5 h-5" /> View
                      </button>
                    </td>
                    <td className="p-3 border flex gap-3">
                      <button 
                        onClick={() => handleView(student)}
                        className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(student)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        title="Edit Student"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        title="Delete Student"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GRADE 4-6 PENDING VERIFICATION TABLE */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-red-800 mb-4">Grade 4–6 Students (Pending Verification)</h3>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">LRN</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Grade</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pendingStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No pending verification requests
                  </td>
                </tr>
              ) : (
                pendingStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{student.lrn}</td>
                    <td className="p-3 border">{student.fullName}</td>
                    <td className="p-3 border">{student.email}</td>
                    <td className="p-3 border">{student.gradeLevel}</td>
                    <td className="p-3 border flex gap-3">
                      <button className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700" title="Approve">
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700" title="Reject">
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleView(student)}
                        className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR CODE MODAL */}
      {showQRModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">QR Code - {selectedStudent.fullName}</h3>
            <div className="flex justify-center mb-4">
              <img src={selectedStudent.qrCode} alt="QR Code" className="w-64 h-64 border-4 border-gray-300 rounded-lg" />
            </div>
            <p className="text-center text-gray-600 mb-4">LRN: {selectedStudent.lrn}</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDownloadQR(selectedStudent)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Download QR
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Edit Student - {selectedStudent.fullName}</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  value={editFormData.firstName}
                  onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  value={editFormData.lastName}
                  onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Section</label>
                <input
                  type="text"
                  value={editFormData.section}
                  onChange={(e) => setEditFormData({...editFormData, section: e.target.value})}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Contact</label>
                <input
                  type="text"
                  value={editFormData.contact || ''}
                  onChange={(e) => setEditFormData({...editFormData, contact: e.target.value})}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateStudent}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Student Details</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">LRN</p>
                  <p className="font-semibold">{selectedStudent.lrn}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Name</p>
                  <p className="font-semibold">{selectedStudent.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Sex</p>
                  <p className="font-semibold">{selectedStudent.sex}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Grade Level</p>
                  <p className="font-semibold">{selectedStudent.gradeLevel}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Section</p>
                  <p className="font-semibold">{selectedStudent.section}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="font-semibold">{selectedStudent.status}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}