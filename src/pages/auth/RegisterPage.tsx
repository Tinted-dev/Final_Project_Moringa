import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RegisterData, Region } from '../../types';
import { API_URL } from '../../config';

const RegisterPage: React.FC = () => {
  const { register: registerCompany, error } = useAuth();
  const navigate = useNavigate();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<RegisterData>();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${API_URL}/regions`);
        setRegions(response.data);
      } catch (error) {
        console.error('Failed to fetch regions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerCompany(data);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the auth context
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <div className="flex justify-center">
            <UserPlus size={40} className="text-primary-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register your company
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in if you already have an account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <div className="mt-1">
                <input
                  id="company_name"
                  type="text"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.company_name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  {...register('company_name', { required: 'Company name is required' })}
                />
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
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
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  type="tel"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  {...register('phone', { required: 'Phone number is required' })}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="regions" className="block text-sm font-medium text-gray-700">
                Service Regions
              </label>
              <div className="mt-1">
                <select
                  id="regions"
                  multiple
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.regions ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  {...register('regions', { required: 'At least one region is required' })}
                >
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.regions && (
                  <p className="mt-1 text-sm text-red-600">{errors.regions.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Hold CTRL or CMD to select multiple regions</p>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Company Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows={4}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
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
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Registering...
                </div>
              ) : (
                'Register Company'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;