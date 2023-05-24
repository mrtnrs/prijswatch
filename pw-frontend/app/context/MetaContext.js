// contexts/MetaContext.js
import React, { useState } from 'react';

const MetaContext = React.createContext({});

export const MetaProvider = ({ children }) => {
  const [meta, setMeta] = useState({});

  const value = { meta, setMeta };

  return <MetaContext.Provider value={value}>{children}</MetaContext.Provider>;
};

export default MetaContext;
