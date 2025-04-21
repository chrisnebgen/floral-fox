import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import LinksModal from '../LinksModal';
import { FaEdit } from 'react-icons/fa';

const defaultLinks = [
  { heading: 'Social', links: [{ label: 'Facebook', url: 'https://facebook.com' }, { label: 'Twitter', url: 'https://twitter.com' }] },
  { heading: 'Search', links: [{ label: 'Google', url: 'https://google.com' }, { label: 'Bing', url: 'https://bing.com' }] },
  { heading: 'Tech', links: [{ label: 'GitHub', url: 'https://github.com' }, { label: 'StackOverflow', url: 'https://stackoverflow.com' }] },
];

const LinksGrid = ({ linksData, setLinksData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const safeLinksData = (Array.isArray(linksData) && linksData.length > 0) ? linksData : defaultLinks;

  useEffect(() => {
    if (safeLinksData.length > 0) {
      localStorage.setItem('linksData', JSON.stringify(safeLinksData));
    }
  }, [safeLinksData]);

  return (
    <div className={styles.linksGridContainer}>
      <div className={styles.header}>
        <button
          className={styles.editButton}
          onClick={() => setIsModalOpen(true)}
          aria-label="Edit Links"
        >
          <FaEdit className={styles.editIcon} />
        </button>
      </div>

      <div className={styles.linksGrid}>
        {safeLinksData.length > 0 ? (
          safeLinksData.map((category, index) => (
            <div 
              key={index}
              className={styles.column}
              role="region"
              aria-labelledby={`category-${index}`}
            >
              <h3 id={`category-${index}`}>{category.heading}</h3>
              {category.links.length > 0 ? (
                <ul>
                  {category.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${link.label} in a new tab`}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyMessage}>No links available</p>
              )}
            </div>
          ))
        ) : (
          <p className={styles.emptyMessage}>No categories available</p>
        )}
      </div>

      {isModalOpen && (
        <LinksModal
          linksData={safeLinksData}
          setLinksData={(data) => {
            setLinksData(data);
            localStorage.setItem('linksData', JSON.stringify(data));
          }}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default LinksGrid;