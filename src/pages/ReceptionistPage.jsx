import React, { useState } from 'react';
import { FiLogOut, FiCalendar } from 'react-icons/fi'; // Import FiCalendar for appointments
import { useNavigate } from 'react-router-dom';
import RecHome from './RecHome'; // Import RecHome component

const ReceptionistPage = () => {
  const [showAppointments, setShowAppointments] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-8" style={{ height: '650px' }}>
        <h2 className="text-2xl font-bold">Receptionist</h2>
        <ul className="mt-10 space-y-4">
          <li>
            <a 
              href="#"
              className="text-white flex items-center"
              onClick={() => setShowAppointments(true)} // Show appointments management
            >
              <FiCalendar className="mr-2" /> Set Appointments
            </a>
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
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10">
        {showAppointments ? (
          <RecHome /> // Render RecHome component for setting appointments
        ) : (
          <div> {/* Add any other functionality here if needed */} </div>
        )}
      </main>
    </div>
  );
};

export default ReceptionistPage;
