import React, { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import { FiLogOut, FiClipboard, FiPackage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MedicineInventory = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState({});
  const [medicineNames, setMedicineNames] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicineData, setMedicineData] = useState({
    name: '',
    expiry: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/medicines');
        const sortedMedicineNames = Object.keys(response.data).sort();
        setMedicines(response.data);
        setMedicineNames(sortedMedicineNames);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchMedicines();
  }, []);

  const handleMedicineChange = (event, value) => {
    if (value && medicines[value]) {
      setSelectedMedicine(value);
      const existingData = medicines[value];
      setMedicineData({
        name: value,
        expiry: existingData.expiry || '',
        price: existingData.price || '',
        quantity: existingData.quantity || '',
      });
    } else {
      setSelectedMedicine(null);
      setMedicineData({
        name: value || '',
        expiry: '',
        price: '',
        quantity: '',
      });
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setMedicineData((prevData) => ({
      ...prevData,
      name: newInputValue,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const { name, expiry, price, quantity } = medicineData;

    if (!name || !expiry || !price || !quantity) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      if (selectedMedicine) {
        // Update existing medicine
        await axios.put(`http://localhost:3000/api/medicines/${name}`, {
          expiry,
          price,
          quantity,
        });

        // Update the medicine data immediately in the state
        setMedicines((prevMedicines) => ({
          ...prevMedicines,
          [name]: { expiry, price, quantity },
        }));

        alert(`Medicine "${name}" updated successfully.`);
      } else {
        // Add new medicine
        await axios.post('http://localhost:3000/api/medicines', {
          name,
          expiry,
          price,
          quantity,
        });

        // Update the medicine data immediately in the state
        setMedicines((prevMedicines) => ({
          ...prevMedicines,
          [name]: { expiry, price, quantity },
        }));

        // Update the list of medicine names and keep it sorted
        setMedicineNames((prevNames) => [...prevNames, name].sort());

        alert(`Medicine "${name}" added successfully.`);
      }

      // Clear the form fields
      setMedicineData({
        name: '',
        expiry: '',
        price: '',
        quantity: '',
      });
      setSelectedMedicine(null);
    } catch (error) {
      console.error('Error saving medicine:', error);
      alert('Failed to save medicine. Please try again.');
    }
  };

  const handlePrescriptionManagementClick = () => {
    navigate('/prescription-management');
  };

  const handleMedicineInventoryClick = () => {
    navigate('/medicine-inventory');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 text-white">
        <div className="text-3xl font-bold p-6 border-b border-gray-700">
          Medical
        </div>
        <ul className="p-4 space-y-6">
          <li
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-200"
            onClick={handlePrescriptionManagementClick}
          >
            <FiClipboard size={20} />
            <span>Prescription Management</span>
          </li>
          <li
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-200"
            onClick={handleMedicineInventoryClick}
          >
            <FiPackage size={20} />
            <span>Medicine Inventory</span>
          </li>
          <li className="mt-auto">
            <a
              href="#"
              className="text-white flex items-center"
              onClick={() => navigate('/dashboard')} // Navigate to Dashboard on logout
            >
              <FiLogOut className="mr-2" /> Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-10">
        <Container className="mt-12">
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            className="font-bold text-blue-400 text-center mb-6"
          >
            Medicine Inventory Management
          </Typography>

          <Box mt={3}>
            <Paper elevation={3} className="p-6 rounded-md shadow-lg bg-white">
              <form onSubmit={handleFormSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                      freeSolo
                      options={medicineNames}
                      value={medicineData.name || ''}
                      onInputChange={handleInputChange}
                      onChange={handleMedicineChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Medicine Name"
                          name="name"
                          required
                          className="w-full"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="date"
                      name="expiry"
                      label="Expiry Date"
                      value={medicineData.expiry || ''}
                      onChange={(e) => setMedicineData((prevData) => ({ ...prevData, expiry: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      name="price"
                      label="Price"
                      value={medicineData.price || ''}
                      onChange={(e) => setMedicineData((prevData) => ({ ...prevData, price: e.target.value }))}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      name="quantity"
                      label="Quantity"
                      value={medicineData.quantity || ''}
                      onChange={(e) => setMedicineData((prevData) => ({ ...prevData, quantity: e.target.value }))}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      style={{ backgroundColor: '#90caf9', color: '#fff' }}
                      className="w-full hover:bg-blue-700 transition duration-200"
                    >
                      {selectedMedicine ? 'Update Medicine' : 'Add Medicine'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Box>

          {/* Display Medicine Records Table */}
          <Box mt={6}>
            <Typography variant="h6" gutterBottom>
              Medicine Records
            </Typography>
            <Paper elevation={3} className="p-6 rounded-md shadow-lg bg-white">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Medicine Name</th>
                    <th className="px-4 py-2 text-left">Expiry Date</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(medicines).map((medicineName) => (
                    <tr key={medicineName} className="border-b">
                      <td className="px-4 py-2">{medicineName}</td>
                      <td className="px-4 py-2">{medicines[medicineName].expiry}</td>
                      <td className="px-4 py-2">{medicines[medicineName].price}</td>
                      <td className="px-4 py-2">{medicines[medicineName].quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Paper>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default MedicineInventory;
