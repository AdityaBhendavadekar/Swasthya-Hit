import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const RecHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeDoctorId, setActiveDoctorId] = useState(null);
  const [date, setDate] = useState('');
  const [queue, setQueue] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.post('http://localhost:3000/rec/appointments', {
          nin: Cookies.get('nin'),
          opd: Cookies.get('rec_opd') // Replace with the actual OPD
        });

        const fetchedAppointments = response.data.appointments;
        setAppointments(fetchedAppointments);
        setDate(response.data.date);

        if (fetchedAppointments.length > 0) {
          setActiveDoctorId(fetchedAppointments[0].doctorId);
        }

        const initialQueue = fetchedAppointments.reduce((acc, appointment) => {
          const inQueuePatients = appointment.patients.filter(
            (patient) => patient.status === 'inqueue'
          );
          if (inQueuePatients.length > 0) {
            acc[appointment.doctorId] = inQueuePatients;
          }
          return acc;
        }, {});

        setQueue(initialQueue);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const updatePatientStatus = async (doctorId, patientId, newStatus) => {
    try {
      await axios.post('http://localhost:3000/rec/update-status', {
        nin: Cookies.get('nin'),
        opd: Cookies.get('rec_opd'), // Use actual OPD
        doctorId,
        patientId,
        status: newStatus,
      });
      console.log(`Patient ${patientId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating patient status:', error);
    }
  };

  const addToQueue = (doctorId, patient) => {
    const newStatus = patient.status === 'pending' ? 'inqueue' : 'pending';

    updatePatientStatus(doctorId, patient.patientId, newStatus);

    setQueue((prevQueue) => {
      const currentQueue = prevQueue[doctorId] || [];

      if (newStatus === 'inqueue') {
        return {
          ...prevQueue,
          [doctorId]: [...currentQueue, patient]
        };
      } else {
        return {
          ...prevQueue,
          [doctorId]: currentQueue.filter((p) => p.patientId !== patient.patientId)
        };
      }
    });

    // Update the local appointment state for the UI
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.doctorId === doctorId
          ? {
              ...appointment,
              patients: appointment.patients.map((p) =>
                p.patientId === patient.patientId ? { ...p, status: newStatus } : p
              ),
            }
          : appointment
      )
    );
  };

  const renderPatients = (patients) => {
    // Categorize patients by status
    const pendingPatients = patients.filter((p) => p.status === 'pending');
    const inQueuePatients = patients.filter((p) => p.status === 'inqueue');
    const donePatients = patients.filter((p) => p.status === 'done');

    // Concatenate the sorted patients
    const sortedPatients = [...pendingPatients, ...inQueuePatients, ...donePatients];

    return sortedPatients.map((patient) => (
      <div
        key={patient.patientId}
        className={`flex justify-between items-center p-3 rounded-lg mb-2 shadow-md transition-all duration-300 ${
          patient.status === 'pending'
            ? 'bg-white border'
            : patient.status === 'inqueue'
            ? 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300'
            : 'bg-gradient-to-r from-green-100 to-green-200 border-green-300'
        }`}
      >
        <span className="font-medium text-gray-700">Name: {patient.name}</span>
        <span className="text-gray-600">ID: {patient.patientId}</span>
        {patient.status !== 'done' && (
          <button
            onClick={() => addToQueue(activeDoctorId, patient)}
            className={`py-2 px-4 rounded-lg text-white shadow-lg hover:bg-opacity-80 transition-all duration-300 ${
              patient.status === 'inqueue'
                ? 'bg-green-500'
                : 'bg-blue-500'
            }`}
          >
            {patient.status === 'inqueue' ? 'Added To Queue' : 'Add To Queue'}
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="p-6 font-sans bg-gray-100 mt-8">
      <h2 className="text-center mb-4 text-lg font-semibold text-gray-800">
        Appointments for {date}
      </h2>

      <div className="flex gap-4 mb-6 justify-center">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment.doctorId}
              className={`p-4 border rounded-lg cursor-pointer shadow-md hover:shadow-lg transition duration-300 ${
                activeDoctorId === appointment.doctorId
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100'
                  : 'border-gray-300 bg-white'
              }`}
              onClick={() => setActiveDoctorId(appointment.doctorId)}
            >
              <h3 className="font-medium text-gray-700">Doctor ID: {appointment.doctorId}</h3>
            </div>
          ))
        ) : (
          <p>No appointments found</p>
        )}
      </div>

      <div>
        <h4 className="mb-4 text-xl font-semibold text-gray-700">
          Patients for Doctor {activeDoctorId}
        </h4>
        {activeDoctorId &&
          appointments
            .filter((appointment) => appointment.doctorId === activeDoctorId)
            .map((appointment) => renderPatients(appointment.patients))}
      </div>

      <div className="mt-8">
        <h4 className="mb-4 text-lg font-semibold text-gray-700">
          Current Queue for Doctor {activeDoctorId}
        </h4>
        {queue[activeDoctorId] && queue[activeDoctorId].length > 0 ? (
          queue[activeDoctorId].map((patient) => (
            <div
              key={patient.patientId}
              className="flex justify-between items-center p-3 bg-blue-100 rounded-lg mb-2 shadow-sm"
            >
              <span className="font-medium text-gray-700">Name: {patient.name}</span>
              <span className="text-gray-600">ID: {patient.patientId}</span>
            </div>
          ))
        ) : (
          <p>No patients in the queue for this doctor</p>
        )}
      </div>
    </div>
  );
};

export default RecHome;
