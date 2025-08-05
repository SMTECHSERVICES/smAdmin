import React, { useState, useEffect } from 'react'
import Layout from '../../layout/Layout'
import axios from 'axios'
import { server } from '../../constant/api'
import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const AllEmployer = () => {
  const [data, setData] = useState({
    employers: [],
    totalEmployers: 0,
    currentPage: 1,
    totalPages: 1,
    count: 0,
    loading: true,
    error: null
  })

  const [filters, setFilters] = useState({
    search: '',
    verification: '',
  })

  const navigate = useNavigate()

  const fetchEmployers = async (page = 1) => {
    try {
      setData(prev => ({ ...prev, loading: true }))
      const { search, verification } = filters

      const response = await axios.get(`${server}/employers`, {
        params: {
          page,
          search,
          verification
        },
        withCredentials: true
      })

      setData({
        employers: response.data.employers,
        totalEmployers: response.data.totalEmployers,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        count: response.data.count,
        loading: false,
        error: null
      })
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch employers'
      }))
    }
  }

  useEffect(() => {
    fetchEmployers()
  }, [])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= data.totalPages) {
      fetchEmployers(newPage)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">All Employers</h1>
          <p className="text-gray-600">
            Showing {data.count} of {data.totalEmployers} employers
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search by Company Name"
            className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-1/3"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <select
            className="border border-gray-300 px-3 py-2 rounded-md"
            value={filters.verification}
            onChange={(e) => setFilters(prev => ({ ...prev, verification: e.target.value }))}
          >
            <option value="">All</option>
            <option value="verified">Verified</option>
            <option value="not_verified">Not Verified</option>
          </select>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            onClick={() => fetchEmployers(1)}
          >
            Apply Filters
          </button>
        </div>

        {data.loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : data.error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto mt-8" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{data.error}</span>
          </div>
        ) : data.employers.length === 0 ? (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative max-w-2xl mx-auto">
            No employers found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.employers.map(employer => (
                    <tr key={employer._id} onClick={() => navigate(`/admin/employers/${employer._id}`)} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={employer.companyLogoUrl || 'https://via.placeholder.com/150'}
                              alt={employer.companyName}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employer.companyName}</div>
                            {employer.companyWebsite && (
                              <a
                                href={employer.companyWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                              >
                                <FaGlobe className="mr-1" /> Website
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employer.fullName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaEnvelope className="mr-1" /> {employer.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaPhone className="mr-1" /> {employer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {employer.isVerified ? (
                            <>
                              <FaCheckCircle className="text-green-500 mr-2" />
                              <span className="text-sm text-green-800">Verified</span>
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="text-yellow-500 mr-2" />
                              <span className="text-sm text-yellow-800">Pending</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employer.companyDocUrl && (
                          <a
                            href={employer.companyDocUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            <FaFilePdf className="mr-1" /> View Documents
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-indigo-300" />
                          {new Date(employer.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{data.currentPage}</span> of <span className="font-medium">{data.totalPages}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(data.currentPage - 1)}
                    disabled={data.currentPage === 1}
                    className={`px-3 py-1 rounded-md ${data.currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                  >
                    <FaChevronLeft />
                  </button>
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${data.currentPage === page ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(data.currentPage + 1)}
                    disabled={data.currentPage === data.totalPages}
                    className={`px-3 py-1 rounded-md ${data.currentPage === data.totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default AllEmployer
