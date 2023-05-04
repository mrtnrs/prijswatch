import React from 'react';
import '@/styles/radar.css'

const RadarScanner = () => {
  return (
    <div className="panel">
    <div className="lines"></div>
      <div className="circle circle-1"></div>
  <div className="circle circle-2"></div>
      <div className="scanner"></div>
    </div>
  );
};

export default RadarScanner;
