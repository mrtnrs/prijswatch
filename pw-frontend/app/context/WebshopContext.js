import { createContext, useState } from 'react';

const WebshopContext = createContext();

export const WebshopProvider = ({ children }) => {
  const [selectedWebshop, setSelectedWebshop] = useState(null);

  return (
    <WebshopContext.Provider value={{ selectedWebshop, setSelectedWebshop }}>
      {children}
    </WebshopContext.Provider>
  );
};

export default WebshopContext;
