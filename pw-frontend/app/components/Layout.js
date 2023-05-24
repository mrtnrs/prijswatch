import React from 'react';
import '../styles/globals.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        {/* Your header content goes here */}
      <p>Header</p>
      </header>
      <nav className="nav">
        {/* Your navigation content goes here */}
      </nav>
      <main className="main">{children}</main>
      <footer className="footer">
        {/* Your footer content goes here */}
       <p>Footer</p>
      </footer>
    </div>
  );
};

export default Layout;