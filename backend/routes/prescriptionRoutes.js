const express = require('express');
const { db } = require('../firebase');
const admin = require('firebase-admin');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("hello patient");
});

// Get all Patient IDs for Autocomplete
router.get('/getAllPatientIDs', async (req, res) => {
    try {
        const patientsRef = db.collection('Patients');
        const snapshot = await patientsRef.get();
        
        if (snapshot.empty) {
            return res.status(404).send('No patient data found.');
        }

        const patientIDs = [];
        snapshot.forEach(doc => {
            patientIDs.push({ id: doc.id }); // Assuming doc.id is the patient ID
        });

        res.status(200).json(patientIDs); // Return patient IDs for autocomplete
    } catch (error) {
        console.error('Error fetching patient IDs:', error);
        res.status(500).send('Error fetching patient IDs');
    }
});

// Get specific Patient data by ID
router.get('/getPatientData/:patientID', async (req, res) => {
    const { patientID } = req.params;

    try {
        const patientRef = db.collection('Patients').doc(patientID);
        const patientDoc = await patientRef.get();

        if (!patientDoc.exists) {
            return res.status(404).send('Patient ID not found.');
        }

        const patientData = patientDoc.data();
        res.status(200).json(patientData); // Send patient data back to the frontend
    } catch (error) {
        console.error('Error fetching patient data:', error);
        res.status(500).send('Error fetching patient data');
    }
});

// // Update specific prescription data for a patient
// router.put('/updatePrescription/:patientID', async (req, res) => {
//   const { patientID } = req.params;
//   const date = req.query.date; // Get the date from query parameters
//   const { tableName, newQuantity } = req.body; // Assuming you're sending the table name and new quantity in the request body

//   // Logging the received values for debugging
//   console.log('Received patientID:', patientID);
//   console.log('Received date:', date);
//   console.log('Received tableName:', tableName);
//   console.log('Received newQuantity:', newQuantity);

//   try {
//     const patientRef = db.collection('Patients').doc(patientID);
//     const patientDoc = await patientRef.get();

//     if (!patientDoc.exists) {
//       return res.status(404).send('Patient ID not found.');
//     }

//     // Update the prescription quantity
//     await patientRef.update({
//       [`Previous Records.04/09/2024.Prescription.Dolo 650.Quantity`]: newQuantity,
//     });

//     res.status(200).send('Prescription updated successfully.');
//   } catch (error) {
//     console.error('Error updating prescription:', error);
//     res.status(500).send(`Error updating prescription ${error}`);
//   }
// });

router.put('/:pId/update-prescription', async (req, res) => {
  const { pId } = req.params; // Get patient ID from request parameters
  const { date, tabletUpdates } = req.body; // Get date and updated tablet data from request body

  if (!date || !tabletUpdates) {
      return res.status(400).send({ error: 'Date and tabletUpdates are required.' });
  }

  try {
      const patientRef = db.collection('Patients').doc(pId); // Reference to the patient document

      // Prepare the update object
      const updates = {};
      for (const [tabletName, quantity] of Object.entries(tabletUpdates)) {
          updates[`Previous Records.${date}.Prescription.${tabletName}.Quantity`] = quantity; // Update quantity for each tablet
      }

      // Update the patient document with the new quantities
      await patientRef.update(updates);
      res.status(200).send({ message: 'Prescription updated successfully!' });
  } catch (error) {
      console.error('Error updating prescription:', error);
      res.status(500).send({ error: `Failed to update prescription. ${error.message}` });
  }
});


module.exports = router;