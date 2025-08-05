import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaFilePdf,
  FaGlobe,
  FaPhone,
  FaTimesCircle,
  FaUser,
} from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { server } from '../../constant/api'
import Layout from '../../layout/Layout'

const EmployerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employer, setEmployer] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [jobsLoading, setJobsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [verifying, setVerifying] = useState(false)

  // Pagination & Filter & Search state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalApplications, setTotalApplications] = useState(0)
  const [totalJobsPosted, setTotalJobsPosted] = useState(0)
  const [filterStatus, setFilterStatus] = useState('all') // all / verified / unverified
  const [searchTitle, setSearchTitle] = useState('')

  const limit = 5 // Jobs per page

  // Fetch employer details (only once on load)
  const fetchEmployer = async () => {
    try {
      const response = await axios.get(`${server}/employer-detail/${id}`, {
        withCredentials: true,
      })
      setEmployer(response.data.employer)
      setError(null)
    } catch (error) {
      setError(
        error.response?.data?.message || 'Failed to fetch employer details'
      )
    }
  }

  // Fetch jobs with pagination, filter and search
  const fetchJobs = async () => {
    try {
      setJobsLoading(true)

      // Build query params
      let query = `?page=${currentPage}&limit=${limit}`
      if (filterStatus !== 'all') {
        query += `&verified=${filterStatus === 'verified' ? 'true' : 'false'}`
      }
      if (searchTitle.trim() !== '') {
        query += `&search=${encodeURIComponent(searchTitle.trim())}`
      }

      const response = await axios.get(
        `${server}/employer-jobs/${id}${query}`,
        {
          withCredentials: true,
        }
      )

      setJobs(response.data.jobs)
      setTotalApplications(response.data.totalApplications)
      setTotalJobsPosted(response.data.totalJobs)
      setTotalPages(response.data.totalPages)
      setJobsLoading(false)
      setError(null)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      setJobsLoading(false)
      setError('Failed to fetch jobs')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetchEmployer()
      await fetchJobs()
      setLoading(false)
    }
    fetchData()
  }, [id])

  // Reload jobs on page, filter or search change
  useEffect(() => {
    if (employer) {
      fetchJobs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterStatus, searchTitle])

  const handleVerify = async (value) => {
    try {
      setVerifying(true)
      await axios.put(
        `${server}/employer-verification/${id}`,
        { isVerified: value },
        { withCredentials: true }
      )
      await fetchEmployer()
      setVerifying(false)
    } catch (error) {
      console.error('Verification error:', error)
      setVerifying(false)
      alert('Failed to update verification status')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? You want to delete this account')) {
      try {
        const { data } = await axios.delete(`${server}/employer/${id}`, {
          withCredentials: true,
        })
        alert(data?.message)
        navigate('/admin/employers')
      } catch (error) {
        console.log(error)
        alert(error?.response?.data?.message)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto mt-8">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </Layout>
    )
  }

  if (!employer) {
    return (
      <Layout>
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative max-w-2xl mx-auto mt-8">
          Employer not found
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Employer Info */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={employer.companyLogoUrl || 'https://via.placeholder.com/150'}
              alt={employer.companyName}
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                  {employer.companyName}
                </h1>
                <p className="text-sm text-gray-500 mt-2 md:mt-0">
                  Registered On:{' '}
                  <span className="font-medium">
                    {formatDate(employer.createdAt)}
                  </span>
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {employer.isVerified ? (
                  <>
                    <span className="text-green-600 font-medium flex items-center">
                      <FaCheckCircle className="mr-1" /> Verified
                    </span>
                    <button
                      onClick={() => handleVerify(false)}
                      disabled={verifying}
                      className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white rounded-md text-sm"
                    >
                      {verifying ? 'Updating...' : 'Unverify'}
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-yellow-600 font-medium flex items-center">
                      <FaTimesCircle className="mr-1" /> Not Verified
                    </span>
                    <button
                      onClick={() => handleVerify(true)}
                      disabled={verifying}
                      className="px-4 py-1 bg-green-600 hover:bg-green-700 cursor-pointer text-white rounded-md text-sm"
                    >
                      {verifying ? 'Updating...' : 'Verify Now'}
                    </button>
                  </>
                )}

                {employer.companyDocUrl && (
                  <a
                    href={employer.companyDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    <FaFilePdf className="mr-2" />
                    View Documents
                  </a>
                )}

                <button
                  onClick={() => handleDelete(id)}
                  disabled={verifying}
                  className="px-4 py-1 bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-md text-sm"
                >
                  Delete Employer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <FaUser className="text-indigo-500 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                <p className="text-sm text-gray-900">{employer.fullName}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaEnvelope className="text-indigo-500 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-sm text-gray-900">{employer.email}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaPhone className="text-indigo-500 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="text-sm text-gray-900">{employer.phone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaGlobe className="text-indigo-500 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Website</h3>
                <a
                  href={employer.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  {employer.companyWebsite}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600">Jobs Posted</h4>
            <p className="text-2xl font-bold text-indigo-700">{totalJobsPosted}</p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600">Applications</h4>
            <p className="text-2xl font-bold text-indigo-700">{totalApplications}</p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600">Verification</h4>
            <p className="text-xl font-semibold">
              {employer.isVerified ? '✅ Verified' : '⏳ Pending'}
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg shadow mb-6 gap-4">
          {/* Filter dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setCurrentPage(1)
              setFilterStatus(e.target.value)
            }}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Jobs</option>
            <option value="verified">Verified Jobs</option>
            <option value="unverified">Unverified Jobs</option>
          </select>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search by job title"
            value={searchTitle}
            onChange={(e) => {
              setCurrentPage(1)
              setSearchTitle(e.target.value)
            }}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow md:max-w-xs"
          />
        </div>

        {/* Job List Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Jobs Posted</h2>
          {jobs.length === 0 && !jobsLoading ? (
            <p className="text-gray-500">No jobs posted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 cursor-pointer">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Salary
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Posted On
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Applications
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobsLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr
                        key={job._id}
                        className="hover:bg-gray-50"
                        onClick={() => navigate(`/admin/job/${job._id}`)}
                      >
                        <td className="px-4 py-2">{job.jobTitle}</td>
                        <td className="px-4 py-2">{job.salary}</td>
                        <td className="px-4 py-2">{job.location}</td>
                        <td className="px-4 py-2">{job.jobType}</td>
                        <td className="px-4 py-2">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {job.applications?.length || 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                  >
                    <FaChevronLeft className="mr-1" /> Previous
                  </button>

                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next <FaChevronRight className="ml-1" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default EmployerDetail
