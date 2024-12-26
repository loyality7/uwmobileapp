import React, { createContext, useState, useContext } from 'react';

export const ServiceContext = createContext();

// Create a custom hook for using the service context
export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};

export const ServiceProvider = ({ children }) => {
  const [currentService, setCurrentService] = useState(null);

  const value = {
    currentService,
    setCurrentService,
    // Add any other service-related functions here
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
}; 