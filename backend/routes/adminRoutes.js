const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const axios = require('axios');
const { db } = require('../firebase');
const { json } = require('stream/consumers');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());  // To handle JSON payloads

// Helper function to dynamically get admin collection based on NIN ID
const getAdminCollection = (ninId) => db.collection('Hospitals').doc(ninId).collection('Admin');

router.post('/fetch', async (req, res) => {
  const { collectionName, ninId } = req.body;
  const adminCollection = getAdminCollection(ninId);
  let data;
  try {
    if (collectionName === 'Blood Bank Management' || collectionName === 'Equipment Management') {
      const docRef = adminCollection.doc(collectionName);
      const doc = await docRef.get();
      if (doc.exists) {
        data = doc.data();  // Get the actual data from Firestore
        console.log(data);
      } else {
        return res.status(404).json({ error: 'No such document!' });
      }
    } 
    else if (collectionName === 'OPD') {
      const opdRef = adminCollection.doc('OPD');
      const subcollections = await opdRef.listCollections();
      const subcollectionsData = {};
      for (const subcollection of subcollections) {
        const subcollectionName = subcollection.id;
        const docs = await subcollection.get();
        const documents = {};

        docs.forEach(doc => {
          documents[doc.id] = doc.data();
        });
        subcollectionsData[subcollectionName] = documents;
      }
      data = { collections: Object.keys(subcollectionsData), data: subcollectionsData };  // Prepare the data for response
    } 
    res.json(data); 
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Error fetching document' });
  }
});

router.post('/insertAppointment', async (req, res) => {
  const { collectionName, subCollection, doctorId, newAppointment, ninId } = req.body;
  const adminCollection = getAdminCollection(ninId);

  console.log('Inserting appointment...');
  console.log('Collection:', collectionName);
  console.log('Subcollection:', subCollection);
  console.log('Doctor ID:', doctorId);
  console.log('New Appointment:', newAppointment);

  try {
    const opdRef = adminCollection.doc(collectionName);
    console.log('OPD Reference:', opdRef.path);

    const subCollectionRef = opdRef.collection(subCollection);
    console.log('Subcollection Reference:', subCollectionRef.path);

    const doctorDocRef = subCollectionRef.doc('Doctor');
    console.log('Doctor Document Reference:', doctorDocRef.path);

    // Set the new appointment inside the specified DoctorID map
    await doctorDocRef.set(
      {
        [doctorId]: {
          [newAppointment.date]: {
            Start: newAppointment.start,
            End: newAppointment.end,
          },
        },
      },
      { merge: true }
    );

    res.status(200).send({ message: 'Appointment inserted successfully!' });
  } catch (error) {
    console.error('Error inserting appointment:', error);
    res.status(500).send({ message: 'Error inserting appointment' });
  }
});

router.post('/addsomething', async (req, res) => {
  const { name, ninId } = req.body;
  const adminCollection = getAdminCollection(ninId);

  try {
    const newSomething1 = adminCollection.doc('OPD').collection(name).doc('Doctor');
    await newSomething1.set({});
    const newSomething2 = adminCollection.doc('OPD').collection(name).doc('Treatment time');
    await newSomething2.set({});
    const newSomething3 = adminCollection.doc('OPD').collection(name).doc('Receptionist');
    await newSomething3.set({});
    console.log('Adding OPD done');
    res.send(`${name} added`);
  } catch (ex) {
    console.log(`addSomething Exception ${ex}`);
    res.send('Not Added');
  }
});

router.post('/submitinventory', async (req, res) => {
  const { data, collectionName, ninId } = req.body;
  const adminCollection = getAdminCollection(ninId);

  try {
    const docRef = adminCollection.doc(collectionName);
    await docRef.set(data, { merge: true });
    console.log('Data Updated in Firebase');
  } catch (ex) {
    console.log(`submitInventory Exception ${ex}`);
  }
});

router.post('/timeslot', async (req, res) => {
  const { data, selectedSubCollection, key, ninId } = req.body;
  const adminCollection = getAdminCollection(ninId);

  try {
    const docRef = adminCollection.doc('OPD').collection(selectedSubCollection).doc('Doctor');
    const docRefData = (await docRef.get()).data();

    await docRef.set({
      ...docRefData,
      [key]: {
        shift: data,
      },
    }, { merge: true });

    console.log(key);
  } catch (ex) {
    console.log(`timeslot Exception ${ex}`);
  }
});

router.post('/doctorinformation', async (req, res) => {
  const { data, selectedSubCollection, ninId } = req.body;
  const adminCollection = getAdminCollection(ninId);

  try {
    const doctorData = (await adminCollection.doc('OPD').collection(selectedSubCollection).doc('Doctor').get()).data();
    const doctor = adminCollection.doc('OPD').collection(selectedSubCollection).doc('Doctor');
    const totals = adminCollection.doc('OPD');
    const totalsData = (await totals.get()).data();
    const credentials = db.collection('Hospitals').doc(ninId).collection('Credentials').doc('doctors');
    const credentialsData = (await credentials.get()).data();
    const { doctorPassword, ...newData } = data;
    const docID = 'Doc_' + totalsData.totalDoctors;
    const info = {
      ...doctorData,
      [docID]: {
        shift: {},
        information: {
          ...newData,
        },
      },
    };

    await totals.set({
      totalDoctors: parseInt(totalsData.totalDoctors + 1),
    });
    await doctor.set(info);
    await credentials.set({
      ...credentialsData,
      [docID]: {
        uname: docID,
        pass: doctorPassword,
      },
    });
  } catch (ex) {
    console.log(`doctorinformation Exception ${ex}`);
  }
});
// New route to handle deleting an equipment item
router.delete('/deleteEquipment', async (req, res) => {
  const { collectionName, equipmentId, ninId } = req.body;
  const adminCollection = getAdminCollection(ninId);

  try {
    const docRef = adminCollection.doc(collectionName);
    await docRef.update({
      [equipmentId]: admin.firestore.FieldValue.delete(), // This will remove the equipment
    });
    
    console.log(`Equipment ${equipmentId} deleted from ${collectionName}`);
    res.status(200).send({ message: 'Equipment deleted successfully!' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).send({ message: 'Error deleting equipment' });
  }
});
router.post('/submitinventory', async (req, res) => {
  const { data, collectionName, ninId } = req.body;
  const adminCollection = getAdminCollection(ninId);

  try {
      const docRef = adminCollection.doc(collectionName);
      await docRef.set(data, { merge: true }); // Merge the existing data
      console.log('Data Updated in Firebase');
      res.status(200).send({ message: 'Equipment added successfully!' });
  } catch (ex) {
      console.log(`submitInventory Exception ${ex}`);
      res.status(500).send({ message: 'Error updating equipment' });
  }
});
module.exports = router;
