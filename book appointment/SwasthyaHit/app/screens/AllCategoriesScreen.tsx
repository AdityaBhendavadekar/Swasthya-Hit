import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseconfig'; // Adjust the path if needed

interface Doctor {
  id: string;
  name: string;
  degreeName: string;
  category: string;
}
 
const AllCategoriesScreen: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const router = useRouter();

  // Fetch all categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const hospitalsCollection = collection(db, 'Hospitals');
        const hospitalSnapshot = await getDocs(hospitalsCollection);

        const allCategories = new Set<string>();

        for (const doc of hospitalSnapshot.docs) {
          const adminSubCollection = collection(db, `Hospitals/${doc.id}/Admin`);
          const adminSnapshot = await getDocs(adminSubCollection);      
          // for (const adminDoc of adminSnapshot.docs) {
          //   if (adminDoc.id === 'OPD') {
          //     const OPDCollection = collection(db, `Hospitals/${doc.id}/Admin/${adminDoc.id}/OPD`);
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

        const categoriesArray = Array.from(allCategories);
        setCategories(categoriesArray);
        setFilteredCategories(categoriesArray);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = categories.filter(category => category.toLowerCase().includes(query.toLowerCase()));
    setFilteredCategories(filtered);
  };

  // Fetch doctors based on selected category
  const fetchDoctors = async (category: string) => {
    try {
      const hospitalsCollection = collection(db, 'Hospitals');
      const hospitalSnapshot = await getDocs(hospitalsCollection);

      const doctorsList: Doctor[] = [];

      for (const doc of hospitalSnapshot.docs) {
        // const adminSubCollection = collection(db, `Hospitals/${doc.id}/Admin`);
        const adminSubCollection = collection(db, `Hospitals/${doc.id}/Admin/OPD/${category}`);
        const adminSnapshot = await getDocs(adminSubCollection);

        for (const adminDoc of adminSnapshot.docs) {
          if (adminDoc.id === 'Doctor') {
            console.log(adminDoc.data())

            const doctorData = adminDoc.data();

            Object.keys(doctorData).forEach((docId) => {
              const doctorInfo = doctorData[docId].information;
              if (doctorInfo) {
                doctorsList.push({
                  id: docId,
                  name: doctorInfo.doctorName,
                  degreeName: doctorInfo.degreeName,
                  category: category
                });
              }
            });

            // const OPDCollection = collection(db, `Hospitals/${doc.id}/Admin/${adminDoc.id}/OPD/${category}/Doctor`);
            // const OPDCollection = collection(db, `Hospitals/${doc.id}/Admin/${adminDoc.id}/${category}/Doctor`);
            // const OPDsnapshot = await getDocs(OPDCollection);

            // for (const docD of OPDsnapshot.docs) {
            //   doctorsList.push({
            //     id: docD.id,
            //     name: docD.data().name as string, // Assuming 'name' is a field in Doctor document
            //     hospitalId: doc.id,
            //     category: category
            //   });
            // }
          }
        }
      }

      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    fetchDoctors(category);
  };

  // Navigate to DoctorDetailScreen
  const handleDoctorPress = (doctor: Doctor) => {
    router.push({
      pathname: '/screens/DoctorDetailScreen',
      params: {
        id: doctor.id,
        name: doctor.name,
        degreeName: doctor.degreeName,
        category: doctor.category
      },
    });
  };

  // Navigate back to the previous screen
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Categories Grid */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {filteredCategories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.gridItem,
              selectedCategory === category && styles.selectedCategory
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text style={styles.gridItemText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Doctors List */}
      {selectedCategory && (
        <View style={styles.doctorsContainer}>
          <Text style={styles.doctorsTitle}>Doctors in {selectedCategory}</Text>
          {doctors.length > 0 ? (
            <FlatList
              data={doctors}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.doctorItem} onPress={() => handleDoctorPress(item)}>
                  <Text style={styles.doctorName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text>Not found</Text>
          )}
        </View>
      )}

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Back</Text>
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
  searchBarContainer: {
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  selectedCategory: {
    backgroundColor: '#007BFF', // Color for selected category
    color: '#fff',
  },
  gridItemText: {
    fontSize: 16,
    color: 'black',
  },
  doctorsContainer: {
    marginBottom: 16,
  },
  doctorsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  doctorItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  doctorName: {
    fontSize: 16,
  },
  backButton: {
    paddingVertical: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default AllCategoriesScreen;
