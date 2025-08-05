import React, { useState, useEffect } from 'react';
import Layout from '../../layout/Layout';
import { server } from '../../constant/api';
import axios from 'axios';
import { 
  FaUser, FaEnvelope, FaPhone, FaEye, 
  FaEdit, FaTrash, FaChevronLeft, FaChevronRight,
  FaGraduationCap, FaCalendarAlt
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const AllMentor = () => {
  const [mentors, setMentors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMentors = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}/mentors?page=${page}`, {
        withCredentials: true
      });
      setMentors(response?.data?.mentors);
      setTotalPages(response?.data?.totalpage);
      setCurrentPage(response?.data?.currentPage);
      setError(null);
    } catch (err) {
      setError('Failed to fetch mentor data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors(currentPage);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchMentors(newPage);
    }
  };
  const navigate = useNavigate()

  const handleDeleteMentor =async (id)=>{
    if(window.confirm('Are you sure? You want to delete this mentor')){
try {
        const response = await axios.delete(`${server}/mentors/${id}`,{withCredentials:true});
        alert(response?.data?.message)
        fetchMentors(currentPage)
    } catch (error) {
        
    }
    }
    
    
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Layout>
      <div className="container mx-auto  px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-1 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl  shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Mentors</p>
                <p className="text-3xl font-bold mt-2">{mentors.length}</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
                <FaGraduationCap className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Active Mentors</p>
                <p className="text-3xl font-bold mt-2">{mentors.length}</p>
              </div>
              <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
                <FaUser className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">New This Month</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
                <FaCalendarAlt className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaGraduationCap className="mr-2 text-indigo-600" />
                  Mentor Management
                </h2>
                <p className="text-gray-600 mt-1">View and manage all registered mentors</p>
              </div>
              <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                Add New Mentor
                <span className="ml-2 text-xl">+</span>
              </button>
            </div>
          </div>
          

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="text-red-500 text-xl mb-2">{error}</div>
              <button 
                onClick={() => fetchMentors(currentPage)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
            
              {/* Mentor Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mentor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Joined
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mentors.map((mentor) => (
                      <tr key={mentor._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {mentor.profilePic ? (
                                <img 
                                  className="h-10 w-10 rounded-full object-cover" 
                                  src={mentor.profilePic} 
                                  alt={mentor.fullName} 
                                />
                              ) : (
                                <div className="bg-indigo-100 h-10 w-10 rounded-full flex items-center justify-center text-indigo-600">
                                  <FaUser />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{mentor.fullName}</div>
                              <div className="text-sm text-gray-500">ID: {mentor._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 flex items-center">
                            <FaEnvelope className="mr-2 text-gray-400" />
                            {mentor.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FaPhone className="mr-2 text-gray-400" />
                            {mentor.phone || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            {formatDate(mentor.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link 
                              to={`/admin/mentors/${mentor._id}`}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors p-1.5 rounded-md hover:bg-indigo-50"
                              title="View Details"
                            >
                              <FaEye className="w-5 h-5" />
                            </Link>
                            <button 
                              className="text-blue-600 hover:text-blue-900 transition-colors p-1.5 rounded-md hover:bg-blue-50"
                              title="Edit Mentor"
                            >
                              <FaEdit className="w-5 h-5" />
                            </button>
                            <button 
                            onClick={()=>handleDeleteMentor(mentor._id)}
                              className="text-red-600 hover:text-red-900 transition-colors p-1.5 rounded-md hover:bg-red-50"
                              title="Delete Mentor"
                            >
                              <FaTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Stats Cards */}
  
      </div>
    </Layout>
  );
};

export default AllMentor;