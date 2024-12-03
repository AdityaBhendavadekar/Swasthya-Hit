import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from "@/widgets/layout"; // Adjust the import path based on your project structure
import routes from "@/routes"; // Assuming routes are defined here
import SignIn from '@/pages/SignIn';
import Dashboard from '@/pages/Dashboard';
import AdminPage from '@/pages/AdminPage';
import MedicalPage from '@/pages/MedicalPage';
import DoctorPage from '@/pages/DoctorPage';
import ReceptionistPage from '@/pages/ReceptionistPage';
import PrescriptionManagement from '@/pages/PrescriptionManagement';
import MedicineInventory from '@/pages/MedicineInventory';
import BloodBank from '@/pages/BloodBank';
import Equipments from '@/pages/Equipments';
import OPD from '@/pages/OPD';


function App() {
  const { pathname } = useLocation(); // useLocation to get current route

  return (
    <div>
      {/* Navbar will always be displayed */}
      <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
        <Navbar routes={routes} /> {/* Navbar displaying the routes */}
      </div>

      <Routes>
        {/* Map through the routes array to dynamically render routes */}
        {routes.map(({ path, element }, key) => (
          element && <Route key={key} exact path={path} element={element} />
        ))}

        {/* Define static routes for specific pages */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/medical" element={<MedicalPage />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/receptionist" element={<ReceptionistPage />} />
        <Route path="/prescription-management" element={<PrescriptionManagement />} />
        <Route path="/medicine-inventory" element={<MedicineInventory />} /> 
        <Route path="/blood-bank" element={<BloodBank />} /> 
        <Route path="/equipment" element={<Equipments />} /> 
        <Route path="/opd" element={<OPD />} /> 
     
      
        {/* Redirect unknown paths to the dashboard or a default page */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;
