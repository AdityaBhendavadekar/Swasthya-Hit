import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import Cookies from 'js-cookie';
import TodayAppointments from './TodayAppointments';
import PatientDetails from './PatientDetails';

const DocHome = () => {
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const nin = Cookies.get('nin');
                let opd = Cookies.get('doc_opd');
                const doctorId = Cookies.get('doc_uname');

                //opd = 'Dentist';

                if (!nin || !opd || !doctorId) {
                    throw new Error('Missing required cookie values.');
                }

                const response = await axios.get(`http://localhost:3000/doc/doctor`, {
                    params: { nin, opd, doctor_id: doctorId },
                });

                if (!response.data) {
                    throw new Error('No doctor information found.');
                }
                alert(response.data)
                setDoctorInfo(response.data);
            } catch (error) {
                console.error('Error fetching doctor information:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchPatients = async () => {
            try {
                const nin = Cookies.get('nin');
                let opd = Cookies.get('doc_opd');
                const doctorId = Cookies.get('doc_uname');

                //opd = "Dentist"

                if (!nin || !opd || !doctorId) {
                    throw new Error('Missing required cookie values.');
                }

                const response = await axios.post(`http://localhost:3000/doc/appointment-queue`,
                    { nin, opd, doctor_id: doctorId },
                );

                if (!response.data || response.data.length === 0) {
                    throw new Error('No patients found.');
                }

                setPatients(response.data.appointments['0'].patients);
            } catch (error) {
                console.error('Error fetching patient queue:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorInfo();
        fetchPatients();
    }, []);

    const handlePatientClick = (patient) => {
        setSelectedPatient(patient);
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        alert(error);
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-start p-5 bg-gray-100 min-h-screen mt-8">
            <div className="text-center bg-white p-5 w-full shadow-lg rounded-lg mb-5">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">Welcome Dr. {doctorInfo?.information?.doctorName}</h1>
            </div>

            <div className="flex flex-col lg:flex-row w-full gap-5">
                {/* Today's Appointments Component */}
                <TodayAppointments 
                    patients={patients} 
                    onPatientClick={handlePatientClick} 
                    className="flex-1 bg-white p-5 rounded-lg shadow-lg max-h-screen overflow-auto"
                />

                {/* Patient Details Component */}
                <PatientDetails 
                    selectedPatient={selectedPatient} 
                    className="flex-1 bg-white p-5 rounded-lg shadow-lg"
                />
            </div>
        </div>
    );
};

export default DocHome;
