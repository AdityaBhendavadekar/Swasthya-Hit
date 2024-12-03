import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { FaTint, FaPencilAlt, FaHeartbeat, FaUserMd, FaTools, FaComments } from 'react-icons/fa'; // Import additional icons
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const BloodBank = () => {
  const navigate = useNavigate(); // Use navigate hook for redirection

 // Sample data for blood availability and other stats
 const [bloodData, setBloodData] = useState([
  { type: 'A+', value: 25 },
  { type: 'B+', value: 17 },
  { type: 'O+', value: 20 },
  { type: 'AB+', value: 21 },
  { type: 'A-', value: 24 },
  { type: 'B-', value: 19 },
  { type: 'O-', value: 50 },
  { type: 'AB-', value: 0 },
  ]);

  const handleEdit = (type) => {
    const newValue = prompt(`Enter new value for blood group ${type}:`);
    if (newValue !== null) {
      setBloodData(prevData =>
        prevData.map(blood =>
          blood.type === type ? { ...blood, value: parseFloat(newValue) } : blood
        )
      );
    }
  };

  // Define colors for each blood type
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF4C4C', '#4CFF4C'];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white min-h-screen p-5">
        <h1 className="text-2xl font-bold mb-5">ADMIN</h1>
        <ul>
          <li
            className="mb-4 hover:text-green-500 cursor-pointer flex items-center gap-2"
            onClick={() => navigate('/blood-bank')}
          >
            <FaTint /> Blood Bank
          </li>
          <li
            className="mb-4 hover:text-green-500 cursor-pointer flex items-center gap-2"
            onClick={() => navigate('/opd')}
          >
            <FaUserMd /> OPD
          </li>
          <li
            className="mb-4 hover:text-green-500 cursor-pointer flex items-center gap-2"
            onClick={() => navigate('/equipment')}
          >
            <FaTools /> Equipments
          </li>
          
          <li className="mt-auto">
            <a 
              href="#"
              className="text-white flex items-center"
              onClick={() => navigate('/dashboard')} // Navigate to Dashboard on logout
            >
              <FiLogOut className="mr-2" /> Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <h2 className="text-xl font-semibold mb-4">Welcome back Administrator!</h2>

        {/* Pie Chart for Blood Group Details */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Total Blood Group Details</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip />
              <Pie
                data={bloodData}
                dataKey="value"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={180}
                fill="#8884d8"
              >
                {bloodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Available Blood per group in Liters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Available Blood per group in Liters</h3>

          <div className="grid grid-cols-4 gap-4">
            {bloodData.map((blood) => (
              <div key={blood.type} className="flex flex-col items-center justify-center bg-gray-50 border rounded-lg p-6 shadow">
                <p className="text-2xl font-bold">{blood.value}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-semibold">{blood.type}</span>
                  <FaTint className="text-red-500" />
                  {/* Edit Button */}
                  <button onClick={() => handleEdit(blood.type)} className="text-gray-600 hover:text-blue-500">
                    <FaPencilAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodBank;
