import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const DoctorDetailScreen: React.FC = () => {
  const route = useRoute();
  const router = useRouter();

  // Destructure all the parameters received from the route
  const { id, name, degreeName, category } = route.params as {
    id: string;
    name: string;
    degreeName: string;
    category: string;
  };

  const handleBookAppointment = () => {
    router.push({
      pathname: '/screens/BookAppointmentScreen',
      params: {
        id: id,
        name: name,
        hospitalId: degreeName,
        category: category
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Details</Text>
      <Text style={styles.doctorName}>Name: {name}</Text>
      <Text style={styles.doctorId}>ID: {id}</Text>
      <Text style={styles.hospitalId}>Degree Name: {degreeName}</Text>
      <Text style={styles.category}>Category: {category}</Text>

      <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  doctorName: {
    fontSize: 18,
    marginBottom: 8,
  },
  doctorId: {
    fontSize: 18,
    marginBottom: 8,
  },
  hospitalId: {
    fontSize: 18,
    marginBottom: 8,
  },
  category: {
    fontSize: 18,
    marginBottom: 16,
  },
  bookButton: {
    paddingVertical: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default DoctorDetailScreen;
