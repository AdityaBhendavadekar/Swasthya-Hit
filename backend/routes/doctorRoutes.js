const express = require('express');
const { db } = require('../firebase'); 
const { CatchingPokemonSharp } = require('@mui/icons-material');
const router = express.Router();

router.get('/doctor', async (req, res) => {
    const { nin, opd, doctor_id } = req.query;

    if (!nin || !opd || !doctor_id) {
        return res.status(400).json({ message: 'Missing required query parameters' });
    }

    console.log(`Received nin: ${nin}, opd: ${opd}, doctor_id: ${doctor_id}`);

    try {
        // Get a reference to the specific doctor document
        const doctorRef = db.collection('Hospitals')
            .doc(nin)
            .collection('Admin')
            .doc('OPD')
            .collection('Dental')
            .doc('Doctor');

        // Fetch the doctor document
        const doctorDoc = await doctorRef.get();

        // Check if the document exists
        if (!doctorDoc.exists) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Access doctor data by doctor_id
        const doctorData = doctorDoc.data()[doctor_id];

        if (!doctorData) {
            return res.status(404).json({ message: 'Doctor data not found for the given ID' });
        }

        // Extract doctor information and shifts
        const information = doctorData.information || {};
        const shift = doctorData.shift || {};

        const formattedInfo = {
            doctorName: information.doctorName || 'N/A',
            degreeName: information.degreeName || 'N/A',
        };

        const formattedShift = Object.entries(shift).map(([date, shiftDetails]) => ({
            date,
            start: shiftDetails.Start || 'N/A',
            end: shiftDetails.End || 'N/A',
        }));

        res.status(200).json({
            doctorId: doctor_id,
            information: formattedInfo,
            shifts: formattedShift,
        });
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        res.status(500).json({ message: 'Error fetching doctor details' });
    }
});

router.post('/appointment-queue', async (req, res) => {
    const { nin, opd } = req.body;
    const today = new Date().toISOString().split('T')[0];
        try {
        const opdRef = db.collection('Hospitals')
            .doc(nin)
            .collection('Appointment Details')
            .doc(today) 
            .collection(opd);

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
                
                if (patientInfo.status === 'done' || patientInfo.status === 'inqueue') {
                    patients.push({
                        patientId: patId,
                        name: patientInfo.name,
                        slot: patientInfo.slot,
                        mobileNo: patientInfo.mobile,
                        status: patientInfo.status,
                    });
                }
            }
            
            if (patients.length > 0) {
                result.push({
                    today,
                    doctorId,
                    patients,
                });
            }
        });

        res.status(200).json({ appointments: result });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});

router.post('/saveprescription', async (req, res) => {
    const { patient, medicines, followUpTime, notes } = req.body;

    if (!patient || !medicines || medicines.length === 0) {
        return res.status(400).json({ message: 'Patient ID and medicines are required' });
    }

    try {
        // Get today's date in 'YYYY-MM-DD' format
        const today = new Date().toISOString().split('T')[0];

        // Reference to the patient document in the database
        const patientRef = db.collection('Patients').doc(patient);

        // Prepare the medicines data as key-value pairs
        const medicinesMap = {};
        medicines.forEach((medicine) => {
            medicinesMap[medicine.name] = {
                quantity: medicine.quantity,
                morning: medicine.morning,
                afternoon: medicine.afternoon,
                night: medicine.night,
            };
        });

        // Structure to be saved under today's date in the 'history' map
        const prescriptionData = {
            medicines: medicinesMap,
            followUpTime,
            notes,
        };

        // Update the database under 'history' -> 'today's_date' -> prescription data
        await patientRef.set(
            {
                history: {
                    [today]: prescriptionData
                }
            },
            { merge: true }  // Merges with existing data instead of overwriting
        );

        res.status(200).json({ message: 'Prescription data saved successfully' });
    } catch (error) {
        console.error('Error saving prescription data:', error);
        res.status(500).json({ message: 'Error saving prescription data' });
    }
});



module.exports = router;
