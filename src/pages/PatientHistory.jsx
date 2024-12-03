import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import HistoryIcon from '@mui/icons-material/History';
import MedicationIcon from '@mui/icons-material/Medication';

const PatientHistory = ({ previousRecords }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [prescription, setPrescription] = useState(null);

  // Extract the list of dates from the previous records
  const recordDates = Object.keys(previousRecords);

  // Handle selecting a date to view the details
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setPrescription(previousRecords[date]?.Prescription || null);
  };

  // Handle updating the quantity of a medicine
  const handleQuantityChange = (medicineName, newQuantity) => {
    const updatedPrescription = {
      ...prescription,
      [medicineName]: {
        ...prescription[medicineName],
        Quantity: newQuantity,
      },
    };
    setPrescription(updatedPrescription);
  };

  // Handle removing a medicine from the prescription
  const handleRemove = (medicineName) => {
    const updatedPrescription = { ...prescription };
    delete updatedPrescription[medicineName];
    setPrescription(updatedPrescription);
  };

  const calculateTotal = (quantity, price = 0) => {
    return quantity * price;
  };

  const calculateGrandTotal = () => {
    return Object.entries(prescription || {}).reduce((acc, [medicineName, details]) => {
      const price = 10; // Default price to 0
      return acc + calculateTotal(details.Quantity, price);
    }, 0);
  };

  const handleSave = () => {
    console.log("Prescription saved: ", prescription);
    alert("Prescription saved successfully!");
    // Here you can add logic to send the updated prescription to the server or save it elsewhere
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ mt: 6, px: 4 }}>
      <Divider />

      <Grid container spacing={3} className="mt-4">
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Available Dates
          </Typography>
          <List>
            {recordDates.map((date) => (
              <ListItem
                key={date}
                button
                onClick={() => handleDateClick(date)}
                selected={selectedDate === date}
                className={`cursor-pointer ${selectedDate === date ? 'bg-gray-200' : ''}`}
                sx={{
                  '&.Mui-selected': { bgcolor: '#e0f7fa', borderRadius: 2 },
                  mb: 1,
                }}
              >
                <ListItemText primary={date} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedDate && prescription && (
            <>
              <Typography variant="h6" gutterBottom>
                Prescription Details for {selectedDate} <MedicationIcon />
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Medicine Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price (Default: 0)</TableCell>
                      <TableCell>Total (Default: 0)</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(prescription).map(([medicineName, details]) => {
                      const price = 10; // Default price is 0
                      const total = calculateTotal(details.Quantity, price);

                      return (
                        <TableRow key={medicineName}>
                          <TableCell>{medicineName}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              variant="outlined"
                              size="small"
                              value={details.Quantity}
                              onChange={(e) =>
                                handleQuantityChange(medicineName, parseInt(e.target.value) || 0)
                              }
                            />
                          </TableCell>
                          <TableCell>{price.toFixed(2)}</TableCell> {/* Default: 0 */}
                          <TableCell>{total.toFixed(2)}</TableCell> {/* Default: 0 */}
                          <TableCell>
                            <IconButton
                              color="secondary"
                              onClick={() => handleRemove(medicineName)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={3}>Grand Total</TableCell>
                      <TableCell>{calculateGrandTotal().toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Save and Print Buttons */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="default"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                >
                  Print
                </Button>
              </Box>
            </>
          )}

          {/* Fallback for when there is no Prescription data */}
          {selectedDate && !prescription && (
            <Typography variant="body2" color="textSecondary">
              No prescription data available for this date.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientHistory;
