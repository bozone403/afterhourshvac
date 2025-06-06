import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const ServiceAreaBanner = () => {
  const cities = [
    'Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'Airdrie',
    'Okotoks', 'Cochrane', 'Canmore', 'Banff', 'Camrose', 'Lacombe',
    'Innisfail', 'Olds', 'Didsbury', 'Strathmore', 'High River', 'Turner Valley',
    'Black Diamond', 'Chestermere', 'Rocky View County', 'Foothills County',
    'Mountain View County', 'Drumheller'
  ];

  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % cities.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [cities.length]);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-4 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 text-white">
          <MapPin className="h-5 w-5 text-blue-200" />
          <span className="text-sm md:text-base font-medium">
            Now serving 
          </span>
          <div className="relative h-6 md:h-7 flex items-center">
            <span 
              key={currentCityIndex}
              className="absolute whitespace-nowrap font-bold text-sm md:text-base animate-in slide-in-from-top-2 duration-500"
            >
              {cities[currentCityIndex]}
            </span>
          </div>
          <span className="text-sm md:text-base font-medium">
            and surrounding areas
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaBanner;