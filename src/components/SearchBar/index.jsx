import React, { useState, useCallback } from 'react';
import { FaGoogle, FaFeather } from 'react-icons/fa';
import { DiBingSmall } from 'react-icons/di';
import styles from './styles.module.scss';

const searchEngines = {
  google: { url: 'https://www.google.com/search?q=', icon: <FaGoogle />, label: 'Google Search' },
  bing: { url: 'https://www.bing.com/search?q=', icon: <DiBingSmall />, label: 'Bing Search' },
  duckduckgo: { url: 'https://duckduckgo.com/?q=', icon: <FaFeather />, label: 'DuckDuckGo Search' }
};

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((engine) => {
    if (query.trim() !== '') {
      window.open(searchEngines[engine].url + encodeURIComponent(query), '_blank');
    }
  }, [query]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch('google');
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <form
        className={styles.searchBar}
        role="search"
        aria-label="Site search"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          aria-label="Search input"
        />

        <fieldset className={styles.searchEngines}>
          <legend className="visually-hidden">Choose a search engine</legend>
          {Object.keys(searchEngines).map((engine) => (
            <button
              key={engine}
              type="button"
              onClick={() => handleSearch(engine)}
              className={styles.iconButton}
              aria-label={searchEngines[engine].label}
            >
              {searchEngines[engine].icon}
            </button>
          ))}
        </fieldset>
      </form>
    </div>
  );
};

export default SearchBar;