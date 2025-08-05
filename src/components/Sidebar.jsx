


import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaBriefcase, 
  FaThLarge, 
  FaTasks, 
  FaClock, 
  FaFileAlt,
  FaSignOutAlt,
  FaCheckCircle
} from "react-icons/fa";

import axios from "axios";
import { server } from "../constant/api";

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const navItemClass = (path) =>
    `flex items-center px-4 py-3 rounded-lg transition-all ${
      pathname === path 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
    }`;

     const handleLogout = async()=>{
          try {
            const response = await axios.post(`${server}/logout`,{},{
              withCredentials: true
            });
            alert(response?.data?.message)
            navigate('/')

          } catch (error) {
            console.log(error);
            alert('internal server error')
          }
        }
    

  return (
    <aside className="w-64 bg-white border-r h-screen p-4 flex flex-col">
      {/* Header with icon */}
      <div className="mb-6 pt-4 flex items-center">
        <div className="bg-blue-100 p-2 rounded-lg mr-3">
          <FaBriefcase className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-blue-700">Admin Dashboard</h2>
      </div>
      
      <nav className="space-y-1 flex-1">
        <Link to="/admin/dashboard" className={navItemClass("/admin/dashboard")}>
          <FaThLarge className="mr-3 h-5 w-5" />
          Admin Dashboard
        </Link>
        
        <Link to="/admin/students" className={navItemClass("/admin/students")}>
          <FaTasks className="mr-3 h-5 w-5" />
          All Students
        </Link>
        
        {/* <Link to="/hr/dashboard/attendance" className={navItemClass("/hr/dashboard/attendance")}>
          <FaClock className="mr-3 h-5 w-5" />
         Attendance
        </Link> */}
        <Link to="/admin/mentors" className={navItemClass("/admin/mentors")}>
          <FaClock className="mr-3 h-5 w-5" />
          All Mentors
        </Link>
        
        <Link to="/admin/candidates" className={navItemClass("/admin/candidates")}>
          <FaFileAlt className="mr-3 h-5 w-5" />
          All Candidates
        </Link>

         <Link to="/admin/employers" className={navItemClass("/admin/employers")}>
          <FaFileAlt className="mr-3 h-5 w-5" />
          All Employers
        </Link>

         <Link to="/admin/verfication" className={navItemClass("/admin/verification")}>
          <FaCheckCircle className="mr-3 h-5 w-5" />
          Verification
        </Link>
      </nav> 
      
      {/* Logout at the bottom */}
      <div className="mt-auto py-4 border-t">
         <button onClick={handleLogout} className={navItemClass("/logout")}>
                 <FaSignOutAlt className="mr-3 h-5 w-5" />
                 Logout
               </button>
      </div>
    </aside>
  );
};

export default Sidebar;