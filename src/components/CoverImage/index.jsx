import React from 'react';
import styles from './styles.module.scss';

const CoverImage = () => {
  return (
    <div className={styles.coverImage}>
      <img src="https://fakeimg.pl/1280x300" alt="Cover Image" />
    </div>
  );
};

export default CoverImage;