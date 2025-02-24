import React, { useState } from 'react';
import styles from './styles.module.scss';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const searchEngines = {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q='
  };

  const handleSearch = (engine) => {
    if (query.trim() !== '') {
      window.open(searchEngines[engine] + encodeURIComponent(query), '_blank');
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.searchIcons}>
          {Object.keys(searchEngines).map((engine) => (
            <button
              key={engine}
              type="button"
              onClick={() => handleSearch(engine)}
            >
              {engine.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;