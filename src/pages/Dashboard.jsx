import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CSSTransition } from 'react-transition-group';
import { FiLogOut } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('dashboard');
  const userId = useRef();
  const password = useRef();
  const navigate = useNavigate();

  // Sample data for the chart
  const data = [
    { month: 'Jan', income: 400, expenses: 240 },
    { month: 'Feb', income: 300, expenses: 139 },
    { month: 'Mar', income: 200, expenses: 980 },
    { month: 'Apr', income: 278, expenses: 390 },
    { month: 'May', income: 189, expenses: 480 },
    { month: 'Jun', income: 239, expenses: 380 },
    { month: 'Jul', income: 349, expenses: 430 },
    { month: 'Aug', income: 100, expenses: 200 },
    { month: 'Sep', income: 400, expenses: 300 },
  ];

  const handleLoginClick = (role) => {
    setSelectedRole(role);
    setShowLoginModal(true);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const user = userId.current.value;
    const pass = password.current.value;
    const nn = Cookies.get('nin');

    try {
      const response = await axios.post('http://localhost:3000/auth/user-login', {
        username: user,
        password: pass,
        role: selectedRole,
        nn: nn,
      });

      const info = response.data;
      const d = info.data[user];

      if (response.status === 200) {
        alert(`Login successful for ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}!`);

        if (selectedRole === 'medical') navigate('/medical');
        else if (selectedRole === 'receptionist') {
          Cookies.set('rec_opd', d.opd, { expires: 7 });
          Cookies.set('rec_uname', d.uname, { expires: 7 });
          navigate('/receptionist');
        } else if (selectedRole === 'doctors') {
          Cookies.set('doc_opd', d.opd);
          Cookies.set('doc_uname', d.uname);
          navigate('/doctor');
        } else if (selectedRole === 'admin') navigate('/admin');

        closeModal();
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white p-5">
        <h1 className="text-2xl font-bold mb-5">Dashboard</h1>
        <ul>
          <li
            className={`mb-4 cursor-pointer ${selectedRole === 'dashboard' ? 'text-green-500' : 'hover:text-green-500'}`}
            onClick={() => setSelectedRole('dashboard')}
          >
           Dashboard
          </li>
          {['admin', 'receptionist', 'doctors', 'medical'].map((role) => (
            <li
              key={role}
              className={`mb-4 cursor-pointer ${selectedRole === role ? 'text-green-500' : 'hover:text-green-500'}`}
              onClick={() => handleLoginClick(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </li>
          ))}
          <li className="mt-auto">
            <a 
              href="#"
              className="text-white flex items-center"
              onClick={() => navigate('/sign-in')} // Navigate to Dashboard on logout
            >
              <FiLogOut className="mr-2" /> Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-5">
        {selectedRole === 'dashboard' && (
          <div className="pt-20 p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-red-500 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center items-center h-44">
                <h3 className="text-lg font-semibold">Total Patients</h3>
                <p className="text-3xl">20</p>
              </div>
              <div className="bg-blue-500 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center items-center h-44">
                <h3 className="text-lg font-semibold">Appointments</h3>
                <p className="text-3xl">25</p>
              </div>
              <div className="bg-green-500 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center items-center h-44">
                <h3 className="text-lg font-semibold">Doctors</h3>
                <p className="text-3xl">10</p>
              </div>
              <div className="bg-purple-500 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center items-center h-44">
                <h3 className="text-lg font-semibold">Hospital Earnings</h3>
                <p className="text-3xl">56k</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3">Revenue and Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#8884d8" />
                <Bar dataKey="expenses" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {showLoginModal && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-20">
            <CSSTransition in={showLoginModal} timeout={300} classNames="modal" unmountOnExit>
              <div className="bg-white shadow-2xl p-8 rounded-lg border border-gray-200 w-[400px]">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                  {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login
                </h2>
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="userId" className="block text-lg font-medium mb-2 text-gray-700">User ID</label>
                    <input
                      type="text"
                      id="userId"
                      name="userId"
                      placeholder="Enter your User ID"
                      ref={userId}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-lg font-medium mb-2 text-gray-700">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your Password"
                      ref={password}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-500 transition duration-200 w-full"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="text-red-600 underline mt-4 block w-full text-center"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </form>
              </div>
            </CSSTransition>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
