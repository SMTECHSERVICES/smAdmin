import { lazy, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AdminLoginPage = lazy(()=>import('./pages/AdminLogin'));
const AdminDashboardPage = lazy(()=>import('./pages/Dashboard'))
const AllStudentPage = lazy(()=>import('./pages/student/AllStudent'));
const StudentDetailPage = lazy(()=>import('./pages/student/StudentDetail'));

const AllMentorsPage = lazy(()=>import('./pages/mentor/AllMentor'));
const MentorDetailPage = lazy(()=>import('./pages/mentor/MentorDetail'));

const AllcandidatePage = lazy(()=>import('./pages/candidate/AllCandidate'));
const CandidateDetialPage = lazy(()=>import('./pages/candidate/CandidateDetails'));

const AllEmployerPage = lazy(()=>import('./pages/employer/AllEmployer'));
const EmployerDetailPage = lazy(()=>import('./pages/employer/EmployerDetail'));

const JobDetailPage = lazy(()=>import('./pages/job/JobDetail'))

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      <Route path='/' element={<AdminLoginPage />} />
      <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
      <Route path='/admin/students' element={<AllStudentPage />} />
      <Route path='/admin/student/:id' element={<StudentDetailPage />} />
      <Route path='/admin/mentors' element={<AllMentorsPage />} />
      <Route path='/admin/mentors/:id' element={<MentorDetailPage />} />

         <Route path='/admin/candidates' element={<AllcandidatePage />} />
          <Route path='/admin/candidates/:id' element={<CandidateDetialPage />} />

          <Route path='/admin/employers' element={<AllEmployerPage />} />
          <Route path='/admin/employers/:id' element={<EmployerDetailPage />} />

          <Route path='/admin/verification' element={<EmployerDetailPage />} />
          <Route path='/admin/job/:id' element={<JobDetailPage />} />
    </Routes>
    </>
  )
}

export default App
