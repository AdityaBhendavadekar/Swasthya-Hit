import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa'; // Import trash icon for deleting medicine

const PatientDetails = ({ selectedPatient }) => {
    // State to manage medicine prescriptions
    const [medicines, setMedicines] = useState([
        { name: '', quantity: '', morning: false, afternoon: false, night: false },
    ]);
    const [followUpTime, setFollowUpTime] = useState('');
    const [notes, setNotes] = useState('');

    // Function to handle adding a new medicine row
    const handleAddMedicine = () => {
        setMedicines([...medicines, { name: '', quantity: '', morning: false, afternoon: false, night: false }]);
    };

    // Function to handle deleting a medicine row
    const handleDeleteMedicine = (index) => {
        const updatedMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(updatedMedicines);
    };

    // Function to handle input change for medicines
    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...medicines];
        if (field === 'morning' || field === 'afternoon' || field === 'night') {
            updatedMedicines[index][field] = !updatedMedicines[index][field]; // Toggle the checkbox
        } else {
            updatedMedicines[index][field] = value; // Update other fields
        }
        setMedicines(updatedMedicines);
    };

    // Function to handle saving the prescription
    const handleSave = (e) => {
        e.preventDefault();
        const prescriptionData = {
            patient: selectedPatient.name,
            medicines,
            followUpTime,
            notes,
        };
        console.log('Prescription Data:', prescriptionData);
    };

    return (
        <div className="patient-details p-6 bg-gray-50 rounded-lg shadow-md">
            {selectedPatient ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Patient Details: {selectedPatient.name}</h2>
                    <p className="mb-2">Slot: {selectedPatient.slot}</p>
                    <p className="mb-4">Mobile: {selectedPatient.mobileNo}</p>

                    {/* Dynamic Prescription Table */}
                    <form className="prescription-form" onSubmit={handleSave}>
                        <h3 className="text-xl font-semibold mb-4">Prescribe Medicines</h3>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr>
                                    <th className="border-b-2 border-gray-300 text-left p-2">Medicine Name</th>
                                    <th className="border-b-2 border-gray-300 text-left p-2">Quantity</th>
                                    <th className="border-b-2 border-gray-300 text-left p-2">Time to Take</th>
                                    <th className="border-b-2 border-gray-300 text-left p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map((medicine, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                placeholder="Enter medicine name"
                                                value={medicine.name}
                                                onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                                className="border rounded p-1 w-full"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                placeholder="Enter quantity"
                                                value={medicine.quantity}
                                                onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                                                className="border rounded p-1 w-full"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <div className="flex flex-col">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={medicine.morning}
                                                        onChange={() => handleMedicineChange(index, 'morning')}
                                                    /> Morning
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={medicine.afternoon}
                                                        onChange={() => handleMedicineChange(index, 'afternoon')}
                                                    /> Afternoon
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={medicine.night}
                                                        onChange={() => handleMedicineChange(index, 'night')}
                                                    /> Night
                                                </label>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteMedicine(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            type="button"
                            onClick={handleAddMedicine}
                            className="mb-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                        >
                            Add Medicine
                        </button>

                        {/* Follow Up Time Field */}
                        <div className="mb-4">
                            <label className="block mb-2">Follow-Up Time:</label>
                            <input
                                type="datetime-local"
                                value={followUpTime}
                                onChange={(e) => setFollowUpTime(e.target.value)}
                                className="border rounded p-2 w-full"
                            />
                        </div>

                        {/* Notes Section */}
                        <div className="mb-4">
                            <label className="block mb-2">Suggestions/Notes:</label>
                            <textarea
                                rows="5"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border rounded p-2 w-full"
                            ></textarea>
                        </div>

                        {/* Save Button */}
                        <button
                            type="submit"
                            className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
                        >
                            Save Prescription
                        </button>
                    </form>
                </div>
            ) : (
                <p className="text-gray-600">Please select a patient to view details and add a prescription.</p>
            )}
        </div>
    );
};

export default PatientDetails;
