import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Edit, Trash2, Plus, X } from 'lucide-react';
import { Region } from '../../types';
import { API_URL } from '../../config';

const AdminRegions: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingRegion, setAddingRegion] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [regionName, setRegionName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/regions`, { withCredentials: true });
      setRegions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load regions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleAddClick = () => {
    setAddingRegion(true);
    setEditingRegion(null);
    setRegionName('');
  };

  const handleEditClick = (region: Region) => {
    setEditingRegion(region);
    setAddingRegion(false);
    setRegionName(region.name);
  };

  const handleSaveRegion = async () => {
    if (!regionName.trim()) return;

    setIsSaving(true);
    try {
      if (addingRegion) {
        // Add new region
        const response = await axios.post(
          `${API_URL}/admin/regions`,
          { name: regionName.trim() },
          { withCredentials: true }
        );
        setRegions([...regions, response.data]);
        setSuccessMessage('Region added successfully');
      } else if (editingRegion) {
        // Update existing region
        const response = await axios.put(
          `${API_URL}/admin/regions/${editingRegion.id}`,
          { name: regionName.trim() },
          { withCredentials: true }
        );
        setRegions(regions.map(r => (r.id === editingRegion.id ? response.data : r)));
        setSuccessMessage('Region updated successfully');
      }

      setAddingRegion(false);
      setEditingRegion(null);
      setRegionName('');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to save region');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRegion = async (regionId: number) => {
    if (!confirm('Are you sure you want to delete this region? This may affect companies that are associated with it.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/admin/regions/${regionId}`, { withCredentials: true });
      setRegions(regions.filter(r => r.id !== regionId));
      setSuccessMessage('Region deleted successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to delete region. It may be in use by one or more companies.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setAddingRegion(false);
    setEditingRegion(null);
    setRegionName('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Link to="/admin" className="text-primary-500 hover:text-primary-600 mr-3">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">Manage Regions</h1>
            </div>
            <p className="text-gray-600">
              Create, edit, and manage service regions for companies.
            </p>
          </div>

          <button
            onClick={handleAddClick}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add New Region
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-700 font-medium hover:text-red-900 mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Region Form */}
        {(addingRegion || editingRegion) && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {addingRegion ? 'Add New Region' : 'Edit Region'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="regionName" className="block text-sm font-medium text-gray-700 mb-1">
                  Region Name
                </label>
                <input
                  type="text"
                  id="regionName"
                  value={regionName}
                  onChange={(e) => setRegionName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter region name"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 mr-3"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRegion}
                  disabled={!regionName.trim() || isSaving}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Region'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Regions Table */}
        {!loading && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Companies
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No regions found. Click "Add New Region" to create one.
                    </td>
                  </tr>
                ) : (
                  regions.map(region => (
                    <tr key={region.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{region.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <Link
                            to={`/companies?region=${region.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View Companies
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(region)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteRegion(region.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRegions;
