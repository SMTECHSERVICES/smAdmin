import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { server } from '../../constant/api';
import { toast } from 'react-toastify';
import Layout from '../../layout/Layout';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`${server}/job-detail/${id}`, {
          withCredentials: true,
        });
        setJob(data.job);
        setIsVerified(data.job.isVerified);
      } catch (error) {
        toast.error("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleVerification = async () => {
    try {
      const { data } = await axios.put(
        `${server}/job-verification/${id}`,
        { isVerified: !isVerified },
        { withCredentials: true }
      );
      setIsVerified(!isVerified);
      toast.success("Job verification updated");
    } catch (error) {
      toast.error("Failed to update verification status");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${server}/delete-job/${id}`, {
          withCredentials: true,
        });
        toast.success("Job deleted successfully");
        navigate(-1);
      } catch (error) {
        toast.error("Failed to delete job");
      }
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (!job) return <div className="text-center mt-10 text-red-500">Job not found</div>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{job.jobTitle}</h1>
          <span
            className={`inline-block mt-2 text-sm font-medium px-3 py-1 rounded-full ${
              isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {isVerified ? '✅ Verified' : '❌ Unverified'}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleVerification}
            className={`px-4 py-2 rounded-md font-medium ${
              isVerified
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isVerified ? '🔁 Unverify' : '✅ Verify'}
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className="text-gray-700 mb-4">
        <strong>Location:</strong> {job.location}
      </div>
      <div className="text-gray-700 mb-4">
        <strong>Salary:</strong> {job.salary}
      </div>
      <div className="text-gray-700 mb-4">
        <strong>Type:</strong> {job.jobType}
      </div>

      <div className="text-gray-700 mb-6">
        <strong>Skills Required:</strong>
        <ul className="list-disc list-inside mt-2">
          {job.skillsRequired.split('⭐').map((skill, idx) =>
            skill.trim() ? <li key={idx}>{skill.trim()}</li> : null
          )}
        </ul>
      </div>

      <div className="text-gray-700 whitespace-pre-line mb-6">
        <strong className="block mb-2">Job Description:</strong>
        {job.jobDescription}
      </div>

      <div className="mt-6 border-t pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Company Info</h2>
        <div className="flex items-center gap-4">
          <img
            src={job.company.companyLogoUrl}
            alt="Company Logo"
            className="w-20 h-20 object-cover rounded-full border"
          />
          <div>
            <p className="font-semibold">{job.company.companyName}</p>
            <p>Contact: {job.company.email}</p>
            <p>Phone: {job.company.phone}</p>
            <a
              href={job.company.companyWebsite}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Visit Website
            </a>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default JobDetail;
