import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaIdCard, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';
import Layout from '../../layout/Layout';

const StudentDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get student data from navigation state
  const students = location.state || [];
  const student = students.find(s => s._id === id);
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!student) {
    return (
    <>
    <Layout>
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Not Found</h2>
          <p className="text-gray-600 mb-6">The requested student could not be found in our records.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Students
          </button>
        </div>
      </div>
    </Layout>
    
    </>
    );
  }

  return (
    <>
    <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Students
        </button>
        
        {/* Student Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-gray-400 mb-4 md:mb-0 md:mr-8">
                <FaUser className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{student.fullName}</h1>
                <p className="text-blue-100 mt-1">{student.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-400 bg-opacity-30 rounded-full text-sm">
                    {student.role}
                  </span>
                  <span className="px-3 py-1 bg-blue-400 bg-opacity-30 rounded-full text-sm">
                    Student ID: {student._id.slice(-6)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Student Details */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info Section */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-blue-500" />
                  Personal Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaIdCard className="mt-1 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Student ID</p>
                      <p className="font-medium">{student._id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaEnvelope className="mt-1 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaCalendarAlt className="mt-1 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date Joined</p>
                      <p className="font-medium">{formatDate(student.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaCalendarAlt className="mt-1 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">{formatDate(student.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enrollment Section */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaGraduationCap className="mr-2 text-blue-500" />
                  Course Enrollment
                </h2>
                
                {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {student.enrolledCourses.map((course, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">{course.name || `Course ${index + 1}`}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {course.description || 'No description available'}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Enrolled
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center text-gray-400 mb-4">
                      <FaGraduationCap className="w-8 h-8" />
                    </div>
                    <p className="text-gray-600">This student is not enrolled in any courses yet.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Account Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Profile
                </button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                  Reset Password
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-indigo-600">12</div>
            <div className="text-gray-600 mt-1">Courses Completed</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-indigo-600">87%</div>
            <div className="text-gray-600 mt-1">Average Score</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-indigo-600">42</div>
            <div className="text-gray-600 mt-1">Learning Hours</div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
    </>
  );
};

export default StudentDetail;