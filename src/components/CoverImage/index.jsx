import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

const DEFAULT_IMAGE = 'https://via.placeholder.com/1200x300';

const CoverImage = ({ coverImage }) => {
  const [imageSrc, setImageSrc] = useState(coverImage || DEFAULT_IMAGE);

  useEffect(() => {
    if (coverImage) {
      setImageSrc(coverImage);
    } else {
      setImageSrc(DEFAULT_IMAGE);
    }
  }, [coverImage]);

  const handleError = () => {
    if (imageSrc !== DEFAULT_IMAGE) {
      setImageSrc(DEFAULT_IMAGE);
    }
  };

  return (
    <div
      className={styles.coverImage}
      style={{ backgroundImage: `url(${imageSrc})` }}
    >
      <img
        src={imageSrc}
        alt="Cover"
        onError={handleError}
        className={styles.hiddenImg}
      />
    </div>
  );
};

export default CoverImage;
