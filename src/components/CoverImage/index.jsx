import React from 'react';
import styles from './styles.module.scss';

const CoverImage = () => {
  return (
    <div className={styles.coverImage}>
      <img src="https://fakeimg.pl/800x300" alt="Cover Image" />
    </div>
  );
};

export default CoverImage;