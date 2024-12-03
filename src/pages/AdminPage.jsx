import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminPage = () => {
  const navigate = useNavigate();

  // Automatically navigate to the "Blood Bank" page when the component loads
  useEffect(() => {
    navigate('/blood-bank');
  }, [navigate]);

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

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white min-h-screen p-5">
        <h1 className="text-2xl font-bold mb-5">ADMIN</h1>
        <ul>
          <li
            className="mb-4 hover:text-green-500 cursor-pointer"
            onClick={() => navigate('/blood-bank')}
          >
            Blood Bank
          </li>
          <li className="mb-4 hover:text-green-500 cursor-pointer"
          onClick={() => navigate('/opd')}
          >ODP</li>
          <li
            className="mb-4 hover:text-green-500 cursor-pointer"
            onClick={() => navigate('/equipment')}
          >
            Equipment
          </li>
          <li className="mb-4 hover:text-green-500 cursor-pointer">Review</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Dashboard Content */}
        <div className="pt-20 p-5">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-red-500 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center items-center h-44">
              <h3 className="text-lg font-semibold">Total Patients</h3>
              <p className="text-3xl">783k</p>
            </div>
            <div className="bg-blue-500 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center items-center h-44">
              <h3 className="text-lg font-semibold">Appointments</h3>
              <p className="text-3xl">76</p>
            </div>
            <div className="bg-green-500 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center items-center h-44">
              <h3 className="text-lg font-semibold">Doctors</h3>
              <p className="text-3xl">76</p>
            </div>
            <div className="bg-purple-500 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center items-center h-44">
              <h3 className="text-lg font-semibold">Hospital Earnings</h3>
              <p className="text-3xl">$56k</p>
            </div>
          </div>

          {/* Revenue Chart */}
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
      </div>
    </div>
  );
};

export default AdminPage;