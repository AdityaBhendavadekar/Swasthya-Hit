import React, { useEffect } from 'react';
import { FiLogOut, FiClipboard, FiPackage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function MedicalPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically navigate to the prescription management page when the component mounts.
    navigate('/prescription-management');
  }, [navigate]);

  const handleLogout = () => {
    navigate('/');
  };

  const handlePrescriptionManagementClick = () => {
    navigate('/prescription-management');
  };

  const handleMedicineInventoryClick = () => {
    navigate('/medicine-inventory');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 text-white">
        <div className="text-3xl font-bold p-6 border-b border-gray-700">
          Medical
        </div>
        <ul className="p-4 space-y-6">
          <li
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={handlePrescriptionManagementClick}
          >
            <FiClipboard size={20} />
            <span>Prescription Management</span>
          </li>
          <li
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={handleMedicineInventoryClick}
          >
            <FiPackage size={20} />
            <span>Medicine Inventory</span>
          </li>
          <li
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={handleLogout}
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-10">
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-red-400 p-6 rounded shadow text-white text-center">
            <h3>Total Patients</h3>
            <h1 className="text-4xl">783k</h1>
          </div>
          <div className="bg-blue-400 p-6 rounded shadow text-white text-center">
            <h3>Appointments</h3>
            <h1 className="text-4xl">76</h1>
          </div>
          <div className="bg-green-400 p-6 rounded shadow text-white text-center">
            <h3>Doctors</h3>
            <h1 className="text-4xl">76</h1>
          </div>
          <div className="bg-purple-400 p-6 rounded shadow text-white text-center">
            <h3>Hospital Earnings</h3>
            <h1 className="text-4xl">$56k</h1>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-4">Revenue and Expenses</h3>
          {/* Revenue & Expenses Chart */}
          <div className="chart-container">
            {/* Add any charting library like Chart.js */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalPage;
