import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Edit, Trash2, Search, UserPlus, RefreshCw } from 'lucide-react';
import { Company } from '../../types';
import { API_URL } from '../../config';

const AdminCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStatus, setResetStatus] = useState<{ id: number; status: 'idle' | 'loading' | 'success' | 'error' }[]>([]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/companies`);
      setCompanies(response.data);
      
      // Initialize reset status for all companies
      setResetStatus(response.data.map((company: Company) => ({
        id: company.id,
        status: 'idle'
      })));
      
      setError(null);
    } catch (err) {
      setError('Failed to load companies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDeleteClick = (companyId: number) => {
    setCompanyToDelete(companyId);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;
    
    try {
      await axios.delete(`${API_URL}/admin/companies/${companyToDelete}`, {
        data: { password: confirmPassword }
      });
      
      // Remove deleted company from state
      setCompanies(companies.filter(company => company.id !== companyToDelete));
      setIsDeleting(false);
      setCompanyToDelete(null);
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to delete company. Please check your password and try again.');
      console.error(err);
    }
  };

  const handleResetPassword = async (companyId: number) => {
    // Update status to loading
    setResetStatus(prevStatus => 
      prevStatus.map(status => 
        status.id === companyId ? { ...status, status: 'loading' } : status
      )
    );
    
    try {
      await axios.post(`${API_URL}/admin/companies/${companyId}/reset-password`);
      
      // Update status to success
      setResetStatus(prevStatus => 
        prevStatus.map(status => 
          status.id === companyId ? { ...status, status: 'success' } : status
        )
      );
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setResetStatus(prevStatus => 
          prevStatus.map(status => 
            status.id === companyId ? { ...status, status: 'idle' } : status
          )
        );
      }, 3000);
    } catch (err) {
      // Update status to error
      setResetStatus(prevStatus => 
        prevStatus.map(status => 
          status.id === companyId ? { ...status, status: 'error' } : status
        )
      );
      
      console.error(err);
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setResetStatus(prevStatus => 
          prevStatus.map(status => 
            status.id === companyId ? { ...status, status: 'idle' } : status
          )
        );
      }, 3000);
    }
  };

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.regions.some(region => region.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get reset status for a company
  const getResetStatus = (companyId: number) => {
    return resetStatus.find(status => status.id === companyId)?.status || 'idle';
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
              <h1 className="text-3xl font-bold text-gray-800">Manage Companies</h1>
            </div>
            <p className="text-gray-600">
              View, edit, and manage all waste collection companies on the platform.
            </p>
          </div>
          
          <Link 
            to="/register" 
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            <UserPlus size={18} className="mr-2" />
            Add New Company
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Companies Table */}
        {!loading && filteredCompanies.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Regions
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCompanies.map(company => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{company.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{company.email}</div>
                        <div className="text-sm text-gray-500">{company.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {company.regions.map(region => (
                            <span 
                              key={region.id} 
                              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                            >
                              {region.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => handleResetPassword(company.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Reset Password"
                            disabled={getResetStatus(company.id) === 'loading'}
                          >
                            {getResetStatus(company.id) === 'loading' ? (
                              <RefreshCw size={18} className="animate-spin" />
                            ) : getResetStatus(company.id) === 'success' ? (
                              <span className="text-green-500">✓</span>
                            ) : getResetStatus(company.id) === 'error' ? (
                              <span className="text-red-500">✗</span>
                            ) : (
                              <RefreshCw size={18} />
                            )}
                          </button>
                          <button
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit Company"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(company.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Company"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && filteredCompanies.length === 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No companies matched your search for "${searchTerm}"`
                : "There are no companies registered yet."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-primary-600 hover:text-primary-700"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this company? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleting(false);
                  setCompanyToDelete(null);
                  setConfirmPassword('');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={!confirmPassword}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;