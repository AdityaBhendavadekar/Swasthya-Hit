const express = require('express');
const { db } = require('../firebase');
const admin = require('firebase-admin');
const router = express.Router();

// Hardcoded NIN number
const NIN_NUMBER = '7934792334';

// Helper function to get the reference for the Medicine Management document
const getMedicineManagementRef = () => {
  return db.collection('Hospitals').doc(NIN_NUMBER).collection('Medical').doc('Medicine Management');
};

router.get('/', (req, res)=>{
  res.send("hello")
})

// 1. GET: Retrieve all medicines for the hardcoded NIN number
router.get('/medicines', async (req, res) => {
  try {
    const medicineManagementRef = getMedicineManagementRef();
    const medicineDoc = await medicineManagementRef.get();

    if (!medicineDoc.exists) {
      return res.status(404).send(`No medicines found for NIN ${NIN_NUMBER}`);
    }

    const medicinesData = medicineDoc.data(); // This will return the map of medicines
    res.status(200).json(medicinesData);
  } catch (error) {
    res.status(500).send('Error retrieving medicines: ' + error.message);
  }
});

// 2. POST: Insert a new medicine for the hardcoded NIN number
router.post('/medicines', async (req, res) => {
  const { name, expiry, price, quantity } = req.body;  // medicine details from the request

  if (!name || !expiry || !price || !quantity) {
    return res.status(400).send('Please provide all necessary fields: name, expiry, price, quantity.');
  }

  try {
    const medicineManagementRef = getMedicineManagementRef();

    // Add the new medicine as a map entry (each medicine is a map inside "Medicine Management" document)
    await medicineManagementRef.set({
      [name]: { expiry, price, quantity } // Setting the new medicine
    }, { merge: true });

    res.status(201).send(`Medicine ${name} inserted successfully.`);
  } catch (error) {
    res.status(500).send('Error inserting medicine: ' + error.message);
  }
});

// 3. PUT: Update an existing medicine for the hardcoded NIN number
router.put('/medicines/:medicineName', async (req, res) => {
  const { medicineName } = req.params;
  const { expiry, price, quantity } = req.body;  // fields to update

  if (!expiry || !price || !quantity) {
    return res.status(400).send('Please provide expiry, price, and quantity for the update.');
  }

  try {
    const medicineManagementRef = getMedicineManagementRef();

    // Update the existing medicine
    await medicineManagementRef.update({
      [medicineName]: { expiry, price, quantity }
    });

    res.status(200).send(`Medicine ${medicineName} updated successfully.`);
  } catch (error) {
    res.status(500).send('Error updating medicine: ' + error.message);
  }
});

// 4. DELETE: Delete a specific medicine from the hardcoded NIN number
router.delete('/medicines/:medicineName', async (req, res) => {
  const { medicineName } = req.params;

  try {
    const medicineManagementRef = getMedicineManagementRef();
    
    // Use the Firestore FieldValue.delete() to remove the specific medicine from the map
    await medicineManagementRef.update({
      [medicineName]: admin.firestore.FieldValue.delete()  // Delete the medicine
    });

    res.status(200).send(`Medicine ${medicineName} deleted successfully.`);
  } catch (error) {
    res.status(500).send('Error deleting medicine: ' + error.message);
  }
});

module.exports = router;
