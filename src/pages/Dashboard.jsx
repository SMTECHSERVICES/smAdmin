import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import axios from 'axios';
import { server } from '../constant/api';
import { 
  FaUsers, FaBriefcase, FaUserGraduate, FaChalkboardTeacher, 
  FaFileAlt, FaUserTie, FaChartBar, FaCalendarAlt 
} from 'react-icons/fa';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${server}/getDashboardData`,{withCredentials:true});
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format data for Jobs by Month chart
  const getJobsByMonthData = () => {
    if (!dashboardData || !dashboardData.analytics.jobsByMonth.length) return null;
    
    const months = dashboardData.analytics.jobsByMonth.map(item => {
      const [year, month] = item._id.split('-');
      return new Date(year, month - 1).toLocaleString('default', { month: 'short' });
    });
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Jobs Posted',
          data: dashboardData.analytics.jobsByMonth.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  // Format data for Applications per Job chart
  const getApplicationsPerJobData = () => {
    if (!dashboardData || !dashboardData.analytics.applicationPerJob.length) return null;
    
    const jobTitle = dashboardData.analytics.applicationPerJob.map(item => 
      item.jobTitle
    );
    
    return {
      labels: jobTitle,
      datasets: [
        {
          label: 'Applications',
          data: dashboardData.analytics.applicationPerJob.map(item => item.totalApplications),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  // Summary card component
  const SummaryCard = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center transition-all hover:shadow-lg">
      <div className={`p-4 rounded-lg ${color} text-white mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-10">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Reload Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of platform activities and metrics</p>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard 
            icon={<FaUserGraduate className="w-8 h-8" />} 
            title="Total Students" 
            value={dashboardData.summary.totalStudents} 
            color="bg-indigo-500"
          />
          <SummaryCard 
            icon={<FaChalkboardTeacher className="w-8 h-8" />} 
            title="Total Mentors" 
            value={dashboardData.summary.totalMentors} 
            color="bg-green-500"
          />
          <SummaryCard 
            icon={<FaUserTie className="w-8 h-8" />} 
            title="Total Employers" 
            value={dashboardData.summary.totalEmployers} 
            color="bg-blue-500"
          />
          <SummaryCard 
            icon={<FaBriefcase className="w-8 h-8" />} 
            title="Total Jobs" 
            value={dashboardData.summary.totalJobs} 
            color="bg-amber-500"
          />
          <SummaryCard 
            icon={<FaFileAlt className="w-8 h-8" />} 
            title="Total Applications" 
            value={dashboardData.summary.totalApplications} 
            color="bg-purple-500"
          />
          <SummaryCard 
            icon={<FaUsers className="w-8 h-8" />} 
            title="Total Candidates" 
            value={dashboardData.summary.totalCandidate} 
            color="bg-pink-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Jobs by Month Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Jobs Posted by Month
              </h2>
            </div>
            {getJobsByMonthData() ? (
              <Bar 
                data={getJobsByMonthData()} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            ) : (
              <div className="text-center py-10 text-gray-500">
                No job data available for the selected period
              </div>
            )}
          </div>

          {/* Applications per Job Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaChartBar className="mr-2 text-purple-500" />
                Applications per Job
              </h2>
            </div>
            {getApplicationsPerJobData() ? (
              <Bar 
                data={getApplicationsPerJobData()} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            ) : (
              <div className="text-center py-10 text-gray-500">
                No application data available
              </div>
            )}
          </div>

          {/* Course Analytics Placeholders */}
          {dashboardData.analytics.courseByCategory.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Courses by Category</h2>
              <Pie 
                data={{
                  labels: dashboardData.analytics.courseByCategory.map(item => item._id),
                  datasets: [
                    {
                      data: dashboardData.analytics.courseByCategory.map(item => item.count),
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                      ],
                    }
                  ]
                }}
              />
            </div>
          )}

          {dashboardData.analytics.topCoursesByEnrollment.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Top Courses by Enrollment</h2>
              <Bar 
                data={{
                  labels: dashboardData.analytics.topCoursesByEnrollment.map(item => item._id),
                  datasets: [
                    {
                      label: 'Enrollments',
                      data: dashboardData.analytics.topCoursesByEnrollment.map(item => item.count),
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    }
                  ]
                }}
              />
            </div>
          )}
        </div>

        {/* Empty State Placeholders for Course Analytics */}
        {dashboardData.analytics.courseByCategory.length === 0 && 
         dashboardData.analytics.topCoursesByEnrollment.length === 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Course Analytics</h2>
              <div className="text-center py-10 text-gray-500">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center text-gray-400 mb-4">
                  <FaChartBar className="w-8 h-8" />
                </div>
                <p>No course analytics data available</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;