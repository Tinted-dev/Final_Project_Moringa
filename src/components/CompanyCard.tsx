import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Company } from '../types';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{company.name}</h3>
        
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Phone size={16} className="mr-2 text-primary-500" />
            <span>{company.phone}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Mail size={16} className="mr-2 text-primary-500" />
            <span>{company.email}</span>
          </div>
          <div className="flex items-start text-gray-600">
            <MapPin size={16} className="mr-2 mt-1 text-primary-500" />
            <span>
              {company.regions.map(region => region.name).join(', ')}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {company.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {company.regions.map(region => (
            <span 
              key={region.id} 
              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded"
            >
              {region.name}
            </span>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <a 
          href={`mailto:${company.email}`}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          <Mail size={16} className="mr-2" />
          Contact Now
        </a>
      </div>
    </div>
  );
};

export default CompanyCard;