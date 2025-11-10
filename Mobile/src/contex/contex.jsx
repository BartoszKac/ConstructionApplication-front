import React, { createContext, useContext, useState } from 'react';

const PaintContext = createContext();

export function PaintProvider({ children }) {
  const [paintData, setPaintData] = useState(null);

  return (
    <PaintContext.Provider value={{ paintData, setPaintData }}>
      {children}
    </PaintContext.Provider>
  );
}

export function usePaintData() {
  const context = useContext(PaintContext);
  if (!context) {
    throw new Error('usePaintData must be used within PaintProvider');
  }
  return context;
}