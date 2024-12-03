import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiEdit, FiTrash2 } from 'react-icons/fi';
import Cookies from 'js-cookie';

const Equipements = () => {
  const navigate = useNavigate(); // Use navigate hook for redirection
  const [equipments, setEquipments] = useState({});
  const [newEquipment, setNewEquipment] = useState({ name: '', quantity: '' });
  const [isEditing, setIsEditing] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [loading, setLoading] = useState(true);
  const ninId = Cookies.get('nin');

  // Fetch Equipment data from the server
  const fetchEquipments = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionName: 'Equipment Management', ninId }),
      });

      if (!response.ok) {
        console.error('Error fetching equipment data:', response.statusText);
        return;
      }

      const result = await response.json();
      setEquipments(result);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment({ ...newEquipment, [name]: value });
  };

  const handleEditChange = (e) => {
    setEditQuantity(e.target.value);
  };

  const addEquipment = async () => {
    if (!newEquipment.name || !newEquipment.quantity) {
      alert('Please enter both equipment name and quantity.');
      return;
    }

    const updatedEquipments = {
      ...equipments,
      [newEquipment.name]: parseInt(newEquipment.quantity, 10),
    };

    try {
      const response = await fetch('http://localhost:3000/admin/submitinventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: updatedEquipments,
          collectionName: 'Equipment Management',
          ninId,
        }),
      });

      if (!response.ok) throw new Error('Error adding equipment');

      setEquipments(updatedEquipments);
      setNewEquipment({ name: '', quantity: '' });
      alert('Equipment added successfully!');
    } catch (error) {
      console.error('Error adding equipment:', error);
      alert('Failed to add equipment. Please try again.');
    }
  };

  const saveEdit = async (name) => {
    const updatedEquipments = {
      ...equipments,
      [name]: parseInt(editQuantity, 10),
    };

    try {
      const response = await fetch('http://localhost:3000/admin/submitinventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: updatedEquipments,
          collectionName: 'Equipment Management',
          ninId,
        }),
      });

      if (!response.ok) throw new Error('Error updating equipment');

      setEquipments(updatedEquipments);
      setIsEditing(null);
      setEditQuantity('');
      alert('Equipment updated successfully!');
    } catch (error) {
      console.error('Error updating equipment:', error);
      alert('Failed to update equipment. Please try again.');
    }
  };

  const deleteEquipment = async (name) => {
    try {
      const response = await fetch('http://localhost:3000/admin/deleteEquipment', {
        method: 'DELETE', // Use DELETE method
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionName: 'Equipment Management',
          equipmentId: name, // Send the name as equipmentId to delete
          ninId,
        }),
      });

      if (!response.ok) throw new Error('Error deleting equipment');

      // Remove equipment locally after successful deletion from backend
      const updatedEquipments = { ...equipments };
      delete updatedEquipments[name]; // Remove equipment from local state
      setEquipments(updatedEquipments);
      alert('Equipment deleted successfully!');
    } catch (error) {
      console.error('Error deleting equipment:', error);
      alert('Failed to delete equipment. Please try again.');
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white min-h-screen p-5">
        <h1 className="text-2xl font-bold mb-5">ADMIN</h1>
        <ul>
          <li className="mb-4 hover:text-green-500 cursor-pointer">
            <Link to="/blood-bank">Blood Bank</Link>
          </li>
          <li className="mb-4 hover:text-green-500 cursor-pointer">
            <Link to="/opd">OPD</Link>
          </li>
          <li className="mb-4 hover:text-green-500 cursor-pointer">
            <Link to="/equipements">Equipments</Link>
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

      <div className="flex-grow p-8 mt=20">
        <h2 className="text-2xl font-bold mb-4">Equipment Management</h2>
        {loading ? (
          <p>Loading equipment data...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Equipment Name</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(equipments).map(([name, quantity]) => (
                <tr key={name}>
                  <td className="border px-4 py-2">{name}</td>
                  <td className="border px-4 py-2">{isEditing === name ? (
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      quantity
                    )}</td>
                  <td className="border px-4 py-2 text-center">
  <div className="flex items-center justify-center space-x-2">
    {isEditing === name ? (
      <FiEdit
        onClick={() => saveEdit(name)}
        className="text-green-500 cursor-pointer text-xl transition transform hover:scale-125 hover:text-green-700"
      />
    ) : (
      <FiEdit
        onClick={() => {
          setIsEditing(name);
          setEditQuantity(quantity);
        }}
        className="text-yellow-500 cursor-pointer text-xl transition transform hover:scale-125 hover:text-yellow-700"
      />
    )}
    <FiTrash2
      onClick={() => deleteEquipment(name)}
      className="text-red-500 cursor-pointer text-xl transition transform hover:scale-125 hover:text-red-700"
    />
  </div>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Add New Equipment</h3>
          <input
            type="text"
            name="name"
            placeholder="Equipment Name"
            value={newEquipment.name}
            onChange={handleInputChange}
            className="border px-4 py-2 mr-2 rounded"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newEquipment.quantity}
            onChange={handleInputChange}
            className="border px-4 py-2 mr-2 rounded"
          />
          <button
            onClick={addEquipment}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Equipment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Equipements;
