const express = require('express');
const { db } = require('../firebase');
const router = express.Router();

// Route for hospital login based on NIN number
router.post('/login', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'NIN number is required', status: 'error' });
    }

    try {
        const hospitalRef = db.collection('Hospitals').doc(username);
        const hospitalInfoRef = hospitalRef.collection('Hospital').doc('Information');
        const credentialsDoc = await hospitalInfoRef.get();

        if (credentialsDoc.exists) {
            const data = credentialsDoc.data();
            const name = data.Name;

            res.status(200).json({ message: 'Found', name });
        } else {
            res.status(404).json({ message: 'User not found', status: 'error' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error', status: 'error' });
    }
});

// Route for user login with role-based credentials
router.post('/user-login', async (req, res) => {
    const { username, password, nn, role } = req.body;

    if (!username || !password || !role || !nn) {
        return res.status(400).json({ message: 'Missing required fields', status: 'error' });
    }

    try {
        // Reference to the hospital's credentials collection based on nn and role
        const credentialsRef = db
            .collection('Hospitals')
            .doc(nn) // dynamic nn number for the hospital
            .collection('Credentials')
            .doc(role); // role could be admin, medical, doctor, receptionist

        const credentialsDoc = await credentialsRef.get();

        if (credentialsDoc.exists) {
            const data = credentialsDoc.data();

            // Check if the username and password match the stored values
            if (data[username] && data[username].uname === username && data[username].pass === password) {
                res.status(200).json({ message: 'Login successful', status: 'success', data: data });
            } else {
                res.status(401).json({ message: 'Invalid credentials', status: 'error', s: { username }, st: { storedUsername: data[username]?.uname } });
            }
        } else {
            res.status(404).json({ message: `Role not found for this hospital: ${nn}`, status: 'error' });
        }
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Internal server error', status: 'error' });
    }
});

module.exports = router;
