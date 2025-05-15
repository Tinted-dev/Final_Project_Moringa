import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Building, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Company, Region } from '../../types';
import { API_URL } from '../../config';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<Omit<Company, 'id' | 'user_id' | 'regions'> & { region_ids: number[] }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch company data
        const companyResponse = await axios.get(`${API_URL}/company/profile`);
        setCompany(companyResponse.data);
        
        // Fetch all regions for selection
        const regionsResponse = await axios.get(`${API_URL}/regions`);
        setRegions(regionsResponse.data);
        
        // Set form values
        reset({
          name: companyResponse.data.name,
          email: companyResponse.data.email,
          phone: companyResponse.data.phone,
          description: companyResponse.data.description,
          region_ids: companyResponse.data.regions.map((r: Region) => r.id)
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load company data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, reset]);

  const onSubmit = async (data: any) => {
    try {
      setSaving(true);
      setSuccess(null);
      setError(null);
      
      await axios.put(`${API_URL}/company/profile`, data);
      
      // Refresh company data
      const companyResponse = await axios.get(`${API_URL}/company/profile`);
      setCompany(companyResponse.data);
      
      setSuccess('Company profile updated successfully!');
    } catch (err) {
      setError('Failed to update company profile. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white px-6 py-4">
            <div className="flex items-center">
              <Building size={24} className="mr-3" />
              <h1 className="text-xl font-semibold">Company Dashboard</h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className={`block w-full px-3 py-2 border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    {...register('name', { required: 'Company name is required' })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`block w-full px-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className={`block w-full px-3 py-2 border ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Regions
                  </label>
                  <select
                    multiple
                    className={`block w-full px-3 py-2 border ${
                      errors.region_ids ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    {...register('region_ids', { required: 'At least one region is required' })}
                  >
                    {regions.map(region => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {errors.region_ids && (
                    <p className="mt-1 text-sm text-red-600">{errors.region_ids.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Hold CTRL or CMD to select multiple regions</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Description
                  </label>
                  <textarea
                    rows={6}
                    className={`block w-full px-3 py-2 border ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    {...register('description', {
                      required: 'Description is required',
                      minLength: {
                        value: 20,
                        message: 'Description must be at least 20 characters'
                      }
                    })}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;