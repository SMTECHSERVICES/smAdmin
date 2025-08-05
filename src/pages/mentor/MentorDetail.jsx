import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import { server } from '../../constant/api'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { 
  FaTrash, 
  FaFilePdf, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa'
import { MdUpdate } from 'react-icons/md'
import { FiBook } from 'react-icons/fi'

const MentorDetail = () => {
    const { id } = useParams();
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${server}/mentors/${id}`, { withCredentials: true })
                setMentor(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to fetch mentor details');
                setLoading(false);
            }
        }
        fetchData();
    }, [id])

    const handleDeleteCourse = async (courseId) => {
        try {
            await axios.delete(`${server}/course/${courseId}`, { withCredentials: true });
            setMentor(prev => ({
                ...prev,
                courses: prev.courses.filter(course => course._id !== courseId)
            }));
        } catch (error) {
            console.error('Failed to delete course:', error);
            alert('Failed to delete course');
        }
    }

    // New function to toggle course publish status
    const handleTogglePublish = async (courseId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await axios.put(
                `${server}/course-verification/${courseId}`,
                { isPublished: newStatus },
                { withCredentials: true }
            );
            
            // Update local state to reflect new status
            setMentor(prev => ({
                ...prev,
                courses: prev.courses.map(course => 
                    course._id === courseId 
                        ? { ...course, isPublished: newStatus } 
                        : course
                )
            }));
        } catch (error) {
            console.error('Failed to toggle publish status:', error);
            alert('Failed to update course status');
        }
    }

    if (loading) return <Layout><div className="text-center py-8">Loading...</div></Layout>
    if (error) return <Layout><div className="text-center py-8 text-red-500">{error}</div></Layout>
    if (!mentor) return <Layout><div className="text-center py-8">Mentor not found</div></Layout>

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Mentor Profile Section */}
                    <div className="md:flex">
                        <div className="md:w-1/3 p-6 flex flex-col items-center">
                            <img 
                                src={mentor.profilePic || 'https://via.placeholder.com/150'} 
                                alt={mentor.fullName} 
                                className="w-48 h-48 rounded-full object-cover border-4 border-indigo-100"
                            />
                            <h1 className="text-2xl font-bold mt-4 text-gray-800">{mentor.fullName}</h1>
                            <p className="text-gray-600 capitalize">{mentor.role}</p>
                            
                            <div className="mt-6 w-full space-y-3">
                                <div className="flex items-center text-gray-700">
                                    <FaEnvelope className="mr-2 text-indigo-500" />
                                   <a href={`mailto:${mentor.email}`}><span className='text-black hover:text-blue-500 hover:underline'>{mentor.email}</span></a>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <FaPhone className="mr-2 text-indigo-500" />
                                    <a href={`tel:${mentor.phone}`}>  <span className='text-black hover:text-blue-500'>{mentor.phone}</span></a>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <FaCalendarAlt className="mr-2 text-indigo-500" />
                                    <span>Joined: {new Date(mentor.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <MdUpdate className="mr-2 text-indigo-500" />
                                    <span>Last updated: {new Date(mentor.updatedAt).toLocaleDateString()}</span>
                                </div>
                                {mentor.cv && (
                                    <a 
                                        href={mentor.cv} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center text-indigo-600 hover:text-indigo-800"
                                    >
                                        <FaFilePdf className="mr-2" />
                                        <span>View CV</span>
                                    </a>
                                )}
                            </div>
                        </div>
                        
                        {/* Courses Section */}
                        <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <FiBook className="mr-2" />
                                Courses ({mentor.courses.length})
                            </h2>
                            
                            {mentor.courses.length === 0 ? (
                                <p className="text-gray-500">No courses found</p>
                            ) : (
                                <div className="space-y-4">
                                    {mentor.courses.map(course => (
                                        <div key={course._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex space-x-4">
                                                    {course.thumbnail && (
                                                        <img 
                                                            src={course.thumbnail} 
                                                            alt={course.title} 
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{course.title}</h3>
                                                        <p className="text-sm text-gray-600">{course.description}</p>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                                                {course.category}
                                                            </span>
                                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                {course.duration}
                                                            </span>
                                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                                {course.price < 0 ? 'Free' : `$${course.price}`}
                                                            </span>
                                                            <span className={`text-xs px-2 py-1 rounded ${
                                                                course.isPublished 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {course.isPublished ? 'Published' : 'Draft'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    {/* Publish/Unpublish Button */}
                                                    <button 
                                                        onClick={() => handleTogglePublish(course._id, course.isPublished)}
                                                        className={`p-2 rounded-full ${
                                                            course.isPublished 
                                                                ? 'text-green-500 hover:bg-green-100' 
                                                                : 'text-gray-500 hover:bg-gray-100'
                                                        }`}
                                                        title={course.isPublished ? 'Unpublish course' : 'Publish course'}
                                                    >
                                                        {course.isPublished ? <FaEye /> : <FaEyeSlash />}
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={() => handleDeleteCourse(course._id)}
                                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-full"
                                                        title="Delete course"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default MentorDetail