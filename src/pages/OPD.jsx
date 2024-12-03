import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Popup from './Popup.jsx';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const OPD = ({ collectionName, fetchData }) => {
  const [data, setData] = useState({});
  const [selectedSubCollection, setSelectedSubCollection] = useState('');
  const [opdData, setOpdData] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupForm, setPopupForm] = useState('');
  const [renderFlag, setRenderFlag] = useState(false);
  const [formData, setFormData] = useState('');
  const [key, setKey] = useState('');

  const ninId = Cookies.get('nin');
  const navigate = useNavigate();

  // Load data based on the selected subcollection
  useEffect(() => {
    if (selectedSubCollection) {
      setRenderFlag(true);
      fetchData(collectionName); // Fetch data when subcollection changes
    }
  }, [selectedSubCollection, fetchData, collectionName]);

  // Function to add a new OPD
  const addOPD = async (OPDName) => {
    try {
      const response = await fetch('http://localhost:3000/admin/addsomething', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: OPDName, ninId }),
      });
      if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

      const result = await response.json();
      setPopupForm('');
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error creating new OPD:', error);
    }
  };

  // Handle subcollection selection
  const handleSubCollectionChange = (event) => {
    if (event.target.value === 'addButton') {
      setPopupForm('OPD');
      setIsPopupOpen(true);
    } else {
      setSelectedSubCollection(event.target.value);
    }
  };

  // Render OPD data
  const renderOpdData = () => {
    if (collectionName === 'OPD') {
      return (
        <>
          {selectedSubCollection && (
            <div>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                onClick={() => setPopupForm('Doctor')}
              >
                Add Doctor for {selectedSubCollection}
              </button>
            </div>
          )}
          <div>
            {renderFlag && (
              <ul>
                {Object.keys(opdData[selectedSubCollection]?.Doctor || {}).map((key) => (
                  <li
                    key={key}
                    onClick={() => handleListClick(key)}
                    className="cursor-pointer text-blue-500 hover:underline"
                  >
                    {key}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      );
    }
  };

  // Handle list item click for doctor info
  const handleListClick = (key) => {
    setKey(key);
    setFormData(opdData[selectedSubCollection]?.Doctor[key]?.shift || '');
    setPopupForm('DoctorForm');
    setIsPopupOpen(true);
  };

  // Submit popup data based on form type
  const handlePopupSubmit = (data) => {
    if (popupForm === 'OPD') {
      addOPD(data['opdName']);
    }
    setIsPopupOpen(false);
  };

  // Render fields for collection data
  const renderFields = () => {
    return (
      <select
        className="border border-gray-300 rounded-lg p-2"
        value={selectedSubCollection}
        onChange={handleSubCollectionChange}
      >
        <option value="">Select Subcollection</option>
        {data.collections &&
          data.collections.map((subcollection) => (
            <option key={subcollection} value={subcollection}>
              {subcollection}
            </option>
          ))}
        <option value="addButton">Create New OPD</option>
      </select>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white min-h-screen p-5">
        <h1 className="text-2xl font-bold mb-5">ADMIN</h1>
        <ul>
          <li className="mb-4 hover:text-green-500 cursor-pointer" onClick={() => navigate('/blood-bank')}>
            Blood Bank
          </li>
          <li className="mb-4 hover:text-green-500 cursor-pointer" onClick={() => navigate('/opd')}>
            OPD
          </li>
          <li className="mb-4 hover:text-green-500 cursor-pointer" onClick={() => navigate('/equipment')}>
            Equipments
          </li>
          <li className="mt-auto">
            <a href="#" className="text-white flex items-center" onClick={() => navigate('/dashboard')}>
              <FiLogOut className="mr-2" /> Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 mt-8">
        <h2 className="text-xl font-semibold mb-4">OPD Management</h2>

        {/* Fields and OPD Data */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          {renderFields()}
          <br />
          {renderOpdData()}
        </div>
      </div>

      <Popup
        whichPopupForm={popupForm}
        isOpen={isPopupOpen}
        initialData={formData}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handlePopupSubmit}
      />
    </div>
  );
};

export default OPD;
