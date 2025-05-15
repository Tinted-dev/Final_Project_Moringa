import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import CompanyCard from '../components/CompanyCard';
import RegionFilter from '../components/RegionFilter';
import { Company, Region } from '../types';
import { API_URL } from '../config';

const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch regions
        const regionsResponse = await axios.get(`${API_URL}/regions`);
        setRegions(regionsResponse.data);
        
        // Fetch companies with filter if selected
        let url = `${API_URL}/companies`;
        if (selectedRegion) {
          url += `?region=${selectedRegion}`;
        }
        
        const companiesResponse = await axios.get(url);
        setCompanies(companiesResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRegion]);

  // Filter companies by search term
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.regions.some(region => region.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRegionSelect = (regionId: number | null) => {
    setSelectedRegion(regionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Waste Collection Companies</h1>
          <p className="text-xl text-gray-600">
            Discover reliable garbage collection services in your area
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, description, or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Region Filter */}
        {regions.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <RegionFilter
              regions={regions}
              selectedRegion={selectedRegion}
              onSelectRegion={handleRegionSelect}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredCompanies.length === 0 && (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No companies found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria to find waste collection companies.
              </p>
            </div>
          </div>
        )}

        {/* Companies Grid */}
        {!loading && !error && filteredCompanies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredCompanies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;