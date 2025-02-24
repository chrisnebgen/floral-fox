import React from 'react';
import styles from './styles.module.scss';

const defaultLinks = [
  { heading: 'Social', links: [{ label: 'Facebook', url: 'https://facebook.com' }, { label: 'Twitter', url: 'https://twitter.com' }] },
  { heading: 'Search', links: [{ label: 'Google', url: 'https://google.com' }, { label: 'Bing', url: 'https://bing.com' }] },
  { heading: 'Tech', links: [{ label: 'GitHub', url: 'https://github.com' }, { label: 'StackOverflow', url: 'https://stackoverflow.com' }] },
];

const LinksGrid = ({ linksData }) => {
  const linksToDisplay = Array.isArray(linksData) && linksData.length > 0 ? linksData : defaultLinks;

  return (
    <div className={styles.linksGrid}>
      {linksToDisplay.map((category, index) => (
        <div key={index} className={styles.column}>
          <h3>{category.heading}</h3>
          {category.links.length > 0 ? (
            <ul>
              {category.links.map((link, i) => (
                <li key={i}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMessage}>No links available</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default LinksGrid;