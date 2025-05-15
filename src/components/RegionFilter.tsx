import React from 'react';
import { Region } from '../types';

interface RegionFilterProps {
  regions: Region[];
  selectedRegion: number | null;
  onSelectRegion: (regionId: number | null) => void;
}

const RegionFilter: React.FC<RegionFilterProps> = ({ 
  regions, 
  selectedRegion, 
  onSelectRegion 
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Filter by Region</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectRegion(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedRegion === null
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Regions
        </button>
        
        {regions.map(region => (
          <button
            key={region.id}
            onClick={() => onSelectRegion(region.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedRegion === region.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {region.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegionFilter;