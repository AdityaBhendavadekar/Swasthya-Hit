import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, getDocs, collection, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';
import { Calendar } from 'react-native-calendars';

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
};

const BookAppointmentScreen: React.FC = () => {
  const route = useRoute();
  const { id: doctorId, name: doctorName, hospitalId, category } = route.params as { id: string; name: string; hospitalId: string; category: string };

  const hospitalId1 = '7934792334'

  const [doctorData, setDoctorData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [booked, setBooked] = useState<string[]>([]);
  const [isAppointmentEnabled, setIsAppointmentEnabled] = useState<boolean>(false);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [forms, setForms] = useState<{ [key: string]: { abhaId: string, name: string, address: string, mobile: string, email: string, prescription: { tabletName: string, quantity: string, timeToTake: string }[] } }>({});

  useEffect(() => {
    if (doctorId && hospitalId1 && category) {
      fetchBookedDates();
    }
    generateTimeSlots(); // Generate slots when the component mounts
  }, [doctorId, hospitalId1, category, selectedDate]);

  const fetchBookedDates = async () => {
    
    try {
      // const appointmentsCollectionRef = collection(db, `Hospitals/${hospitalId1}/Hospital/Appointment Details/${selectedDate}/${category}/${doctorId}`);
      const appointmentsCollectionRef = collection(db, `Hospitals/${hospitalId1}/Appointment Details/${selectedDate}/${category}/${doctorId}`);

      const bookedDatesSnapshot = await getDocs(appointmentsCollectionRef);
      const bookedSlots = bookedDatesSnapshot.docs.map(doc => doc.id);
      setBooked(bookedSlots);
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  };

  const generateTimeSlots = () => {
    const startTime = new Date();
    startTime.setHours(9, 0, 0, 0); // Set start time to 9:00 AM
    const endTime = new Date();
    endTime.setHours(17, 0, 0, 0); // Set end time to 5:00 PM
    const slots = [];
    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const endSlotTime = new Date(currentTime.getTime() + 30 * 60 * 1000); // 30 minutes interval
      const startFormatted = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endFormatted = endSlotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      slots.push(`${startFormatted} - ${endFormatted}`);
      currentTime = endSlotTime;
    }

    setTimeSlots(slots);
  };

  const toggleSlot = (slot: string) => {
    setSelectedSlots(prev => {
      const newSelection = new Set(prev);
      newSelection.has(slot) ? newSelection.delete(slot) : newSelection.add(slot);
      setIsAppointmentEnabled(newSelection.size > 0);
      return newSelection;
    });
  };

  const handleBookAppointment = () => {
    const initialForms = {};
    selectedSlots.forEach(slot => {
      initialForms[slot] = {
        abhaId: '',
        name: '',
        address: '',
        mobile: '',
        email: '',
        prescription: [{ tabletName: '', quantity: '', timeToTake: '' }],
      };
    });
    setForms(initialForms);
    setIsFormVisible(true);
  };

  const handleSaveBooking = async () => {
    for (const slot in forms) {
      const form = forms[slot];
      if (!form.abhaId || !form.name || !form.address || !form.mobile) {
        Alert.alert('Error', 'Please fill all the mandatory fields!');
        return;
      }

      try {
        const appointmentRef = doc(db, `Hospitals/${hospitalId1}/Appointment Details/${selectedDate}/${category}/${doctorId}`);
        await setDoc(appointmentRef, {
         [form.abhaId]: {
          name: form.name,
          address: form.address,
          mobile: form.mobile,
          email: form.email || '',
          status: 'pending',
          slot: slot
          }
        }, {merge:true});
      } catch (error) {
        console.error('Error saving appointment details:', error);
        Alert.alert('Error', 'Could not save the appointment details. Please try again.');
        return;
      }
    }

    Alert.alert('Success', 'Appointments successfully booked!');
    setIsFormVisible(false);
    setSelectedSlots(new Set());
    setForms({});
  };

  const updateFormDetails = (slot: string, key: string, value: string, index?: number) => {
    const updatedForms = { ...forms };
    if (index !== undefined) {
      updatedForms[slot].prescription[index] = { ...updatedForms[slot].prescription[index], [key]: value };
    } else {
      updatedForms[slot] = { ...updatedForms[slot], [key]: value };
    }
    setForms(updatedForms);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>
      <Text style={styles.doctorName}>Doctor Name: {doctorName}</Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: 'blue' } }}
        style={styles.calendar}
      />

      <ScrollView horizontal style={styles.horizontalScrollView}>
        {timeSlots.length > 0 && (
          <FlatList
            data={timeSlots}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.slot,
                  selectedSlots.has(item) && styles.selectedSlot,
                  booked.includes(item) && styles.bookedSlot
                ]}
                onPress={() => toggleSlot(item)}
                disabled={booked.includes(item)}
              >
                <Text style={styles.slotText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            numColumns={4}
            contentContainerStyle={styles.grid}
          />
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, !isAppointmentEnabled && { opacity: 0.6 }]}
        onPress={handleBookAppointment}
        disabled={!isAppointmentEnabled}
      >
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>

      <Modal
        visible={isFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFormVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.formTitle}>Save Booking Details</Text>
            <ScrollView style={styles.scrollView}>
              {Object.keys(forms).map(slot => (
                <View key={slot} style={styles.formSection}>
                  <Text style={styles.slotTitle}>Slot: {slot}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ABHA ID"
                    value={forms[slot].abhaId}
                    onChangeText={(text) => updateFormDetails(slot, 'abhaId', text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={forms[slot].name}
                    onChangeText={(text) => updateFormDetails(slot, 'name', text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={forms[slot].address}
                    onChangeText={(text) => updateFormDetails(slot, 'address', text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile"
                    value={forms[slot].mobile}
                    onChangeText={(text) => updateFormDetails(slot, 'mobile', text)}
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={forms[slot].email}
                    onChangeText={(text) => updateFormDetails(slot, 'email', text)}
                    keyboardType="email-address"
                  />
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveBooking}>
              <Text style={styles.buttonText}>Save Appointment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Define styles for container, calendar, form, etc.
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  doctorName: { fontSize: 18, marginBottom: 10 },
  calendar: { marginBottom: 10 },
  slot: { margin: 5, padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' },
  selectedSlot: { backgroundColor: 'blue' },
  bookedSlot: { backgroundColor: 'gray' },
  slotText: { color: 'white' },
  button: { backgroundColor: 'blue', padding: 15, borderRadius: 10, marginTop: 20 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 },
  formTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 5 },
  saveButton: { backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 10 },
});

export default BookAppointmentScreen;
