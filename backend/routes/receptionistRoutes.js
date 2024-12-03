const express = require('express');
const { db } = require('../firebase');
const router = express.Router();

// Test route to check the patient route
router.get('/', (req, res) => {
    res.send("hello patient");
});

// Fetch appointments for today's date and given OPD
router.post('/appointments', async (req, res) => {
    const { nin, opd } = req.body;
    const today = new Date().toISOString().split('T')[0]; 
    // console.log(today)

    try {
        const opdRef = db.collection('Hospitals')
            .doc(nin)
            .collection('Appointment Details')
            .doc(today) // Use today's date dynamically
            .collection(opd);
        console.log(opd);
        const opdSnapshot = await opdRef.get();

        if (opdSnapshot.empty) {
            return res.status(404).json({ message: 'No appointments found for today' });
        }

        const result = [];

        opdSnapshot.forEach(doc => {
            const doctorId = doc.id;
            const doctorData = doc.data();
            const patients = [];

            for (const patId in doctorData) {
                const patientInfo = doctorData[patId];
                patients.push({
                    patientId: patId,
                    name: patientInfo.name,
                    slot: patientInfo.slot,
                    mobileNo: patientInfo.mobile,
                    status: patientInfo.status,
                });
            }

            result.push({
                today,
                doctorId,
                patients,
            });
        });

        res.status(200).json({ appointments: result });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});

// Update patient status by patient ID
router.post('/update-status', async (req, res) => {
    const { nin, opd, doctorId, patientId, status } = req.body;
    const today = new Date().toISOString().split('T')[0]; 
    try {
        // Reference to the patient's document
        const patientRef = db
            .collection('Hospitals')
            .doc(nin)
            .collection('Appointment Details')
            .doc(today) // current date as the document
            .collection(opd)
            .doc(doctorId);

        const patientDoc = await patientRef.get();
        if (!patientDoc.exists) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const patientsData = patientDoc.data();
        if (!patientsData[patientId]) {
            return res.status(404).json({ message: 'Patient ID not found' });
        }

        // Update the status field for the specified patient
        await patientRef.update({
            [`${patientId}.status`]: status, // Update status for specific patient
        });

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

module.exports = router;
