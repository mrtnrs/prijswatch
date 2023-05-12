import React, { useState } from 'react';
import Image from 'next/image';

const CustomLegend = ({ series, children }) => {
  const [visibleWebshops, setVisibleWebshops] = useState(() => {
    // Initially make all webshops visible
    const webshops = {};
    series.forEach(s => {
      webshops[s.webshop] = true;
    });
    return webshops;
  });

  const handleLegendClick = (webshop) => {
    setVisibleWebshops(prev => ({
      ...prev,
      [webshop]: !prev[webshop] // toggle visibility
    }));
  };

  // Filter the series based on the visibleWebshops state
  const filteredSeries = series.filter(s => visibleWebshops[s.webshop]);

  // Render the actual legend
  return (
    <>
    <div className='customLegend' style={{position: 'absolute', zIndex: '9999'}}>
      {Object.entries(visibleWebshops).map(([webshop, isVisible]) => (
        <div 
          key={webshop} 
          onClick={() => handleLegendClick(webshop)} 
          style={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "0.3rem",
            cursor: 'pointer',
            opacity: isVisible ? '.9' : '.4',
            fontWeight: '600',
            fontSize: '.8rem' }}
          >
          <Image 
            src={`/webshoplogos/${webshop}logo.webp`} 
            width={100} 
            height={100}
            style={{ borderRadius: "50%", maxWidth: "2rem", marginRight: '.3rem' }} /> {webshop}
        </div>
      ))}
    </div>
    {children(filteredSeries)}
    </>
  );
};

export default CustomLegend;