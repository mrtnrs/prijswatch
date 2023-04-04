import { useState } from 'react';
const API_URL = 'http://localhost:3001/api/search';

function SearchBar(props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    console.log(query);
    try { 
      fetch(`${API_URL}/?q=${query}`)
      .then(response => {
        if (!response.ok) {
          console.log(response);
          throw new Error('Failed to fetch search results');

        }
        console.log(response);
        return response.json();
      })
      .then(data => setSearchResults(data))
      .catch(error => console.error(error));
    } catch (error) {
      console.error(`Error in fetch request for ${caller}: ${error.message}`);
      throw error;
    }

  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Search for electronics..."
        {...props}
      />
      <div>
        {searchResults.map((result) => (
          <div key={result.id}>
            <img src={result.imageUrl} alt={result.name} />
            <a href={`/smartphones/${result.slug}`}>{result.name}</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBar