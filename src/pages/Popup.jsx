import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Popup = ({ whichPopupForm, isOpen, initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [timeData, setTimeData] = useState(initialData || {});
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    setTimeData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date, field, value) => {
    setTimeData((prevData) => ({
      ...prevData,
      [date]: {
        ...prevData[date],
        [field]: value,
      },
    }));
  };

  const addDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const confirmed = window.confirm(`Do you want to add ${formattedDate}?`);
    if (confirmed) {
      setTimeData((prevData) => ({
        ...prevData,
        [formattedDate]: {
          Start: '',
          End: '',
        },
      }));
      setStartDate(null);
    }
  };

  const handleDeleteDate = (date) => {
    const confirmed = window.confirm(`Do you want to remove this ${date} entry?`);
    if (confirmed) {
      const updatedTimeData = { ...timeData };
      delete updatedTimeData[date];
      setTimeData(updatedTimeData);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (whichPopupForm === 'DoctorForm') {
      onSubmit(timeData);
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  const renderFormFields = () => {
    if (whichPopupForm === 'OPD') {
      return (
        <label className="block mb-4 text-gray-700">
          OPD Name:
          <input
            type="text"
            name="opdName"
            value={formData.opdName || ''}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      );
    } else if (whichPopupForm === 'Doctor') {
      return (
        <>
          <label className="block mb-4 text-gray-700">
            Doctor Name:
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName || ''}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block mb-4 text-gray-700">
            Degree Name:
            <input
              type="text"
              name="degreeName"
              value={formData.degreeName || ''}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block mb-4 text-gray-700">
            Doctor Password:
            <input
              type="password"
              name="doctorPassword"
              value={formData.doctorPassword || ''}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </>
      );
    } else if (whichPopupForm === 'DoctorForm') {
      return (
        <div>
          <button
            type="button"
            onClick={() => setStartDate(new Date())}
            className="bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600"
          >
            Add New Dateslot
          </button>
          {startDate && (
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                addDate(date);
              }}
              dateFormat="dd/MM/yyyy"
              inline
            />
          )}
          {Object.keys(timeData).map((date) => (
            <div key={date} className="time-entry mb-4 border border-gray-300 p-4 rounded shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-700">{date}</h3>
                <button
                  onClick={() => handleDeleteDate(date)}
                  className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  x
                </button>
              </div>
              <label className="block mb-2 text-gray-700">
                Start Time:
                <input
                  type="time"
                  value={timeData[date]?.Start || ''}
                  onChange={(e) => handleDateChange(date, 'Start', e.target.value)}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="block mb-2 text-gray-700">
                End Time:
                <input
                  type="time"
                  value={timeData[date]?.End || ''}
                  onChange={(e) => handleDateChange(date, 'End', e.target.value)}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    isOpen && (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 max-w-lg">
          <h2 className="text-xl mb-4 text-gray-800 font-semibold">
            {whichPopupForm === 'OPD'
              ? 'Create New OPD'
              : whichPopupForm === 'Doctor'
              ? 'Add New Doctor'
              : whichPopupForm === 'DoctorForm'
              ? 'Edit Time Slots'
              : 'Default Title'}
          </h2>
          <form onSubmit={handleSubmit}>
            {renderFormFields()}
            <div className="flex justify-between mt-4">
              <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                Submit
              </button>
              <button type="button" onClick={onClose} className="bg-gray-300 p-2 rounded hover:bg-gray-400">
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default Popup;
