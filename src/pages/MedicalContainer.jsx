import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import MedicineInventory from './MedicineInventory';
import PrescriptionManagement from './PrescriptionManagement';

const MedicalContainer = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <Container maxWidth="md">
        <Paper elevation={3} className="p-4 rounded-lg shadow-lg bg-white">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="success" // Change to green indicator
            textColor="success" // Change to green text color
            variant="fullWidth"
            centered
            className="bg-gray-200 rounded-lg"
          >
            <Tab label="Prescription Management" className="font-bold" />
            <Tab label="Medicine Inventory" className="font-bold" />
          </Tabs>

          <Box mt={3}>
            {currentTab === 0 && <PrescriptionManagement />}
            {currentTab === 1 && <MedicineInventory />}
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default MedicalContainer;
