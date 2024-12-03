import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import { FiLogOut, FiClipboard, FiPackage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PatientHistory from './PatientHistory'; // Import the new component
import HistoryIcon from '@mui/icons-material/History';

const PatientSearch = () => {
  const [patientIDs, setPatientIDs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [patientData, setPatientData] = useState(null); // Store patient data
  const navigate = useNavigate();

  // Fetch patient IDs based on searchText
  useEffect(() => {
    const fetchPatientIDs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/patient/getAllPatientIDs', {
          params: { search: searchText },
        });
        setPatientIDs(response.data);
      } catch (error) {
        console.error('Error fetching patient IDs:', error);
      }
    };

    if (searchText) {
      fetchPatientIDs();
    } else {
      setPatientIDs([]);
    }
  }, [searchText]);

  // Handle input change
  const handleInputChange = (event, value) => {
    setSearchText(value);
  };

  // Handle patient selection
  const handlePatientSelect = async (event, value) => {
    setSelectedPatientID(value);

    if (value) {
      try {
        const response = await axios.get(`http://localhost:3000/patient/getPatientData/${value.id}`);
        setPatientData(response.data); // Store fetched patient data
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    }
  };

  // Sidebar navigation handlers
  const handlePrescriptionManagementClick = () => {
    navigate('/prescription-management');
  };

  const handleMedicineInventoryClick = () => {
    navigate('/medicine-inventory');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar with reduced width */}
      <div className="w-1/5 bg-gray-900 text-white">
        <div className="text-3xl font-bold p-6 border-b border-gray-700">
          Medical
        </div>
        <ul className="p-4 space-y-6">
          <li
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={handlePrescriptionManagementClick} // Add navigation on click
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
      <div className="w-4/5 p-10 mt-10">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Patient Search Section */}
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Patient by ID</h2>
            <div className="w-full max-w-lg">
              <Autocomplete
                freeSolo
                options={patientIDs}
                getOptionLabel={(option) => option.id || ''}
                onInputChange={handleInputChange}
                onChange={handlePatientSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Enter Patient ID"
                    variant="outlined"
                    className="w-full"
                    inputProps={{
                      ...params.inputProps,
                      className: 'bg-gray-100 focus:ring-2 focus:ring-blue-500',
                    }}
                  />
                )}
              />
            </div>
          </div>

          {/* Render the PatientHistory component when patientData is available */}
          {patientData && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient History<HistoryIcon fontSize="large" sx={{ ml: 1 }} /></h3>
              <PatientHistory previousRecords={patientData['Previous Records']} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientSearch;
