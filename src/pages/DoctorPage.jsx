import React, { useEffect, useRef, useState } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FiLogOut } from 'react-icons/fi';
import { FaTachometerAlt, FaCalendarAlt } from 'react-icons/fa'; // Import icons for dashboard and appointments
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import DocHome from './DocHome'; // Import the DocHome component

// Register necessary chart components
Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const DoctorPage = () => {
  const chartRef = useRef(null);
  let doctorPerformanceChart = null;

  // State to manage which view to display
  const [showAppointments, setShowAppointments] = useState(false);

  // Create navigate function
  const navigate = useNavigate();

  // Function to render the chart
  const renderChart = () => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy the existing chart if it exists to avoid canvas reuse error
    if (doctorPerformanceChart) {
      doctorPerformanceChart.destroy();
    }

    doctorPerformanceChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Patients', 'Appointments'],
        datasets: [
          {
            label: 'Doctor Performance',
            data: [45, 60], // Example data
            backgroundColor: ['#4caf50', '#2196f3'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Disable to customize the size manually
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  useEffect(() => {
    renderChart();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-8" style={{ height: '650px' }}>
        <h2 className="text-2xl font-bold">Doctor</h2>
        <ul className="mt-10 space-y-4">
          <li>
            <a 
              href="#"
              className="text-white flex items-center"
              onClick={() => setShowAppointments(false)} // Show performance chart
            >
               Dashboard
            </a>
          </li>
          <li>
            <a 
              href="#"
              className="text-white flex items-center"
              onClick={() => setShowAppointments(true)} // Show appointments
            >
              <FaCalendarAlt className="mr-2" /> Appointments
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
          <DocHome /> // Render DocHome when showing appointments
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 mb-10" style={{ marginTop: '30px' }}>
              {/* Total Patients */}
              <div className="bg-blue-500 text-white p-6 rounded-lg shadow h-32 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Total Patients</h2>
                  <p>45</p>
                </div>
              </div>

              {/* Appointments */}
              <div className="bg-green-500 text-white p-6 rounded-lg shadow h-32 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Appointments</h2>
                  <p>60</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Doctor Performance Chart</h2>
              <div style={{ height: '200px', width: '400px' }}>
                <canvas id="doctorPerformanceChart" ref={chartRef} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DoctorPage;
