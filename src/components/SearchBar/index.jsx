import React, { useState } from 'react';
import { FaGoogle, FaFeather } from 'react-icons/fa';
import { DiBingSmall } from 'react-icons/di';
import styles from './styles.module.scss';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const searchEngines = {
    google: { url: 'https://www.google.com/search?q=', icon: <FaGoogle /> },
    bing: { url: 'https://www.bing.com/search?q=', icon: <DiBingSmall /> },
    duckduckgo: { url: 'https://duckduckgo.com/?q=', icon: <FaFeather /> }
  };

  const handleSearch = (engine) => {
    if (query.trim() !== '') {
      window.open(searchEngines[engine].url + encodeURIComponent(query), '_blank');
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
              className={styles.iconButton}
            >
              {searchEngines[engine].icon}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;