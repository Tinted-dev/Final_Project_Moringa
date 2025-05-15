import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { User, PieChart, MapPin, ClipboardList } from 'lucide-react';
import { API_URL } from '../../config';

interface Stats {
  totalCompanies: number;
  totalRegions: number;
  companiesPerRegion: {
    regionName: string;
    count: number;
  }[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/admin/stats`);
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome to the EcoWaste admin dashboard. Manage companies, regions, and view statistics.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/admin/companies" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
          >
            <div className="bg-primary-100 p-3 rounded-lg mr-4">
              <User size={24} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Manage Companies</h3>
              <p className="text-gray-600">View, edit, and remove companies</p>
            </div>
          </Link>
          
          <Link 
            to="/admin/regions" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
          >
            <div className="bg-primary-100 p-3 rounded-lg mr-4">
              <MapPin size={24} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Manage Regions</h3>
              <p className="text-gray-600">Create, edit, and manage service regions</p>
            </div>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg mr-4">
              <PieChart size={24} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Statistics</h3>
              <p className="text-gray-600">View platform statistics and analytics</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Platform Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold text-primary-600">{stats?.totalCompanies || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Regions</p>
                <p className="text-2xl font-bold text-primary-600">{stats?.totalRegions || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Companies per Region
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {stats?.companiesPerRegion.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.regionName}</span>
                  <span className="font-semibold text-primary-600">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <ClipboardList size={20} className="text-primary-500 mr-2" />
            <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-600 italic">
              Recent platform activity will be shown here in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;