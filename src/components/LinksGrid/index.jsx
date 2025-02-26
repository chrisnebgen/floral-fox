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

  useEffect(() => {
    localStorage.setItem('linksData', JSON.stringify(linksData));
  }, [linksData]);

  return (
    <div className={styles.linksGridContainer}>
      <div className={styles.header}>
        <FaEdit className={styles.editIcon} onClick={() => setIsModalOpen(true)} />
      </div>
      <div className={styles.linksGrid}>
        {linksData.map((category, index) => (
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

      {isModalOpen && (
        <LinksModal
          linksData={linksData}
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