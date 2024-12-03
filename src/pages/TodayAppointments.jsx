import React from 'react';
import { FaCheckCircle, FaClock } from 'react-icons/fa'; // Import icons

const TodayAppointments = ({ patients, onPatientClick }) => {
    // Sort patients based on their status
    const sortedPatients = patients.sort((a, b) => {
        if (a.status === 'done' && b.status !== 'done') return 1; // Move 'done' patients to the end
        if (a.status !== 'done' && b.status === 'done') return -1; // Keep 'inqueue' patients at the top
        return 0; // Keep the order if both have the same status
    });

    return (
        <div className="appointment-list bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Today's Appointments</h2>
            <ul className="scrollable-list max-h-64 overflow-y-auto">
                {sortedPatients.map((patient, index) => (
                    <li 
                        key={index} 
                        onClick={() => onPatientClick(patient)}
                        className={`flex items-center justify-between p-4 border-b cursor-pointer transition-colors duration-200 
                            ${patient.status === 'done' ? 'text-gray-500' : 'text-black hover:bg-gray-100'}`}
                    >
                        <div className="flex items-center">
                            {/* Icon based on status */}
                            {patient.status === 'done' ? (
                                <FaCheckCircle className="text-green-500 mr-2" />
                            ) : (
                                <FaClock className="text-yellow-500 mr-2" />
                            )}
                            <span className="font-medium">{patient.name}</span>
                        </div>
                        <span>{patient.patientId}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodayAppointments;
