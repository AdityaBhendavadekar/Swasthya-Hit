// backend/index.js
const express = require('express');
const cors = require('cors');
const medicineRoutes = require('./routes/medicineRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const authRoutes = require('./routes/authRoutes');
const receptionistRoutes = require('./routes/receptionistRoutes')
const doctorRoutes = require('./routes/doctorRoutes')
const adminRoutes = require('./routes/adminRoutes')

require('./firebase'); // Firebase is initialized and checked here

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use('/api', medicineRoutes);
app.use('/patient', prescriptionRoutes);
app.use('/auth', authRoutes);
app.use('/rec',receptionistRoutes);
app.use('/doc', doctorRoutes);
app.use('/admin', adminRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
