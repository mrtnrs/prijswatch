import React, { useState } from 'react';
import { createWebshop } from '../api/webshopService';

const AddWebshop = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [logo, setLogo] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

  try {
    const newWebshop = await createWebshop({ name, url, logo });
    console.log('Webshop created:', newWebshop);
    // Update the webshop list in the component state or trigger a re-fetch
  } catch (error) {
    console.error('Error creating webshop:', error);
  }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        URL:
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      </label>
      <label>
        Logo:
        <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)} />
      </label>
      <button type="submit">Add Webshop</button>
    </form>
  );
};

export default AddWebshop;
