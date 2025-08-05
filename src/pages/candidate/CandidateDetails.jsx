import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { server } from '../../constant/api'
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaFilePdf, 
  FaMapMarkerAlt, 
  FaGraduationCap,
  FaBriefcase,
  FaMoneyBillWave,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaBriefcase as FaJob,
  FaChevronLeft,
  FaClock
} from 'react-icons/fa'
import Layout from '../../layout/Layout'
import { Link } from 'react-router-dom'

const CandidateDetails = () => {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${server}/candidate-detail/${id}`, { withCredentials: true })
                setData(response.data)
                setLoading(false)
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to fetch candidate details')
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

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
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto mt-8" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </Layout>
        )
    }

    if (!data) {
        return (
            <Layout>
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative max-w-2xl mx-auto mt-8">
                    Candidate not found
                </div>
            </Layout>
        )
    }

    const { candidate, totalApplications, statusCounts, applications } = data

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return <FaCheckCircle className="text-green-500 mr-2" />
            case 'pending':
                return <FaHourglassHalf className="text-yellow-500 mr-2" />
            case 'rejected':
                return <FaTimesCircle className="text-red-500 mr-2" />
            default:
                return <FaHourglassHalf className="text-gray-500 mr-2" />
        }
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Back button */}
                <Link to="/admin/candidates" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
                    <FaChevronLeft className="mr-1" /> Back to Candidates
                </Link>

                {/* Candidate Profile Section */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="p-6 md:flex">
                        <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                            <img 
                                src={candidate.profilePicUrl || 'https://via.placeholder.com/150'} 
                                alt={candidate.fullName} 
                                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 mb-4"
                            />
                            <h1 className="text-2xl font-bold text-gray-800">{candidate.fullName}</h1>
                            <p className="text-gray-600 capitalize">{candidate.role}</p>
                            
                            {candidate.resumeUrl && (
                                <a 
                                    href={candidate.resumeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <FaFilePdf className="mr-2" />
                                    Download Resume
                                </a>
                            )}
                        </div>
                        
                        <div className="md:w-2/3 md:pl-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start">
                                    <FaEnvelope className="text-indigo-500 mt-1 mr-3" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                        <p className="text-sm text-gray-900">{candidate.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaPhone className="text-indigo-500 mt-1 mr-3" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                        <p className="text-sm text-gray-900">{candidate.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaCalendarAlt className="text-indigo-500 mt-1 mr-3" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                                        <p className="text-sm text-gray-900">{new Date(candidate.dob).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaMapMarkerAlt className="text-indigo-500 mt-1 mr-3" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                                        <p className="text-sm text-gray-900">{candidate.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaGraduationCap className="text-indigo-500 mt-1 mr-3" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Qualification</h3>
                                        <p className="text-sm text-gray-900">{candidate.qualification}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaBriefcase className="text-indigo-500 mt-1 mr-3" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                                        <p className="text-sm text-gray-900">{candidate.experience}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaMoneyBillWave className="text-indigo-500 mt-1 mr-3" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${candidate.paymentStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {candidate.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaCalendarAlt className="text-indigo-500 mt-1 mr-3" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Registered On</h3>
                                        <p className="text-sm text-gray-900">{new Date(candidate.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications Summary */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Applications Summary</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-indigo-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-indigo-800">Total Applications</h3>
                                <p className="text-2xl font-semibold text-indigo-900">{totalApplications}</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-yellow-800">Pending</h3>
                                <p className="text-2xl font-semibold text-yellow-900">{statusCounts.pending}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-green-800">Accepted</h3>
                                <p className="text-2xl font-semibold text-green-900">{statusCounts.accepted}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-red-800">Rejected</h3>
                                <p className="text-2xl font-semibold text-red-900">{statusCounts.rejected}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Job Applications</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {applications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                No applications found
                            </div>
                        ) : (
                            applications.map((application, index) => (
                                <div key={index} className="p-6 hover:bg-gray-50">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                                <FaJob className="text-indigo-500 mr-2" />
                                                {application.jobTitle}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 flex items-center">
                                                <FaMapMarkerAlt className="mr-2 text-indigo-300" />
                                                {application.location}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                            <div className="flex items-center">
                                                <FaClock className="mr-2 text-indigo-300" />
                                                <span className="text-sm text-gray-500">
                                                    Applied on {new Date(application.appliedOn).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                {getStatusIcon(application.status)}
                                                <span className={`text-sm font-medium ${
                                                    application.status.toLowerCase() === 'accepted' ? 'text-green-600' :
                                                    application.status.toLowerCase() === 'rejected' ? 'text-red-600' :
                                                    'text-yellow-600'
                                                }`}>
                                                    {application.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CandidateDetails