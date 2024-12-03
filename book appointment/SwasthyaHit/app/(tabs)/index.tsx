import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { db } from '../config/firebaseconfig'; // Adjust the path if needed
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<string>('Fetching location...');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]); // State to hold the fetched hospital data
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  // Fetch user location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
      } catch (error) {
        setErrorMsg('Error fetching location');
      }
    };

    fetchLocation();
  }, []);

  // Fetch unique categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const hospitalsCollection = collection(db, 'Hospitals'); // Ensure this matches your Firestore collection name
        const hospitalSnapshot = await getDocs(hospitalsCollection);

        const allCategories = new Set<string>(); // Use a Set to store unique categories

        for (const doc of hospitalSnapshot.docs) {
          const adminSubCollection = collection(db, `Hospitals/${doc.id}/Admin`);
          const adminSnapshot = await getDocs(adminSubCollection);

          // for (const adminDoc of adminSnapshot.docs) {
          //   if (adminDoc.id === 'OPD') {
          //     const OPDCollection = collection(db, `Hospitals/${doc.id}/Admin/${adminDoc.id}`);
          //     const OPDsnapshot = await getDocs(OPDCollection);

          //     for (const docD of OPDsnapshot.docs) {
          //       allCategories.add(docD.id);
          //     }
          //   }
          // }
          allCategories.add('Dental')
          allCategories.add('Dentist')
          allCategories.add('Eye')
          allCategories.add('Neuro')
          allCategories.add('Ortho')

        }

        setCategories(Array.from(allCategories).slice(0, 5)); // Display only 5 categories initially
      } catch (error) {
        setErrorMsg('Error fetching categories');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch hospital details from Firestore
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const hospitalsCollection = collection(db, 'Hospitals'); // Collection reference
        const hospitalSnapshot = await getDocs(hospitalsCollection);

        const fetchedHospitals: any[] = [];

        // Iterate over each hospital
        for (const doc of hospitalSnapshot.docs) {
          const hospitalId = doc.id;
          console.log("in")
          const infoDocRef = collection(db, `Hospitals/${hospitalId}/Hospital`); // Reference to the Information sub-collection
          const infoSnapshot = await getDocs(infoDocRef);

          console.log(infoSnapshot.docs)

          // Fetch the data fields from the Information collection
          infoSnapshot.forEach((infoDoc) => {
            const data = infoDoc.data();
            fetchedHospitals.push({
              id: hospitalId,
              name: data.Name || 'Unknown Name',
              address: data.Address || 'Unknown Address',
              contact: data.Number || 'Unknown Contact',
              location: data.Location || 'Unknown Location',
              rating: '4.0', // Keep the rating constant for now
              photo: 'https://via.placeholder.com/150', // Placeholder image URL
            });
          });
        }

        setHospitals(fetchedHospitals); // Update state with fetched hospitals
      } catch (error) {
        setErrorMsg('Error fetching hospitals');
        console.error('Error fetching hospitals:', error);
      }
    };

    fetchHospitals();
  }, []);

  const handleCategoryPress = (category: string) => {
    router.push(`/screens/AllCategoriesScreen?category=${category}`); // Pass category to the next screen
  };

  const handleSeeAllCategories = () => {
    router.push('/screens/AllCategoriesScreen'); // Navigate to the all categories screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Action Bar */}
      <View style={styles.header}>
        <Text style={styles.locationText}>{location}</Text>
        <TouchableOpacity style={styles.bellIconContainer}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for hospital, category, doctor"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
      </View>

      {/* Categories Heading */}
      <Text style={styles.categoriesTitle}>Categories</Text>

      {/* Dynamic Categories Grid */}
      <View style={styles.gridContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridItem}
            onPress={() => handleCategoryPress(category)} // Handle category press
          >
            <Text style={styles.gridItemText}>{category}</Text>
          </TouchableOpacity>
        ))}
        {categories.length >= 5 && (
          <TouchableOpacity style={styles.seeMoreItem} onPress={handleSeeAllCategories}>
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Nearby Medical Centres Section */}
      <View style={styles.nearbySection}>
        <Text style={styles.nearbyTitle}>Nearby Medical Centres</Text>
      </View>

      {/* Hospital Cards */}
      <View style={styles.cardsContainer}>
        {hospitals.map((hospital) => (
          <View key={hospital.id} style={styles.card}>
            <Image source={{ uri: hospital.photo }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{hospital.name}</Text>
            <Text style={styles.cardAddress}>{hospital.address}</Text>
            <Text style={styles.cardContact}>{hospital.contact}</Text>
            <Text style={styles.cardRating}>Rating: {hospital.rating}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    color: 'black',
  },
  bellIconContainer: {
    padding: 8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: 'black',
  },
  searchIcon: {
    marginLeft: 8,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gridItemText: {
    fontSize: 16,
    color: 'black',
  },
  seeMoreItem: {
    width: '48%',
    height: 80,
    backgroundColor: '#d9d9d9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeMoreText: {
    fontSize: 16,
    color: '#007BFF',
  },
  nearbySection: {
    marginVertical: 16,
  },
  nearbyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    padding: 8,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  cardAddress: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 4,
  },
  cardContact: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 4,
  },
  cardRating: {
    fontSize: 14,
    color: '#f39c12',
  },
});

export default HomeScreen;