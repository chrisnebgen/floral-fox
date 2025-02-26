import React, { useState, useEffect } from 'react';
import Container from '../Container';
import CoverImage from '../CoverImage';
import Greeting from '../Greeting';
import SearchBar from '../SearchBar';
import LinksGrid from '../LinksGrid';
import DateTimeDisplay from '../DateTimeDisplay';
import SettingsPanel from '../SettingsPanel';
import styles from './styles.module.scss';

const DEFAULT_IMAGE = 'https://via.placeholder.com/1200x300?text=Default+Cover+Image';

const MainLayout = () => {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User');
  const [coverImage, setCoverImage] = useState(localStorage.getItem('coverImage') || DEFAULT_IMAGE);
  const [linksData, setLinksData] = useState(JSON.parse(localStorage.getItem('linksData')) || []);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedImage = localStorage.getItem('coverImage');
    const savedLinks = JSON.parse(localStorage.getItem('linksData')) || [];

    if (savedName) setUserName(savedName);
    if (savedImage) setCoverImage(savedImage);
    if (savedLinks.length > 0) setLinksData(savedLinks);
  }, []);

  return (
    <div className={styles.main}>
      <SettingsPanel
        userName={userName}
        setUserName={setUserName}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        linksData={linksData}
        setLinksData={setLinksData}
      />

      <Container>
        <CoverImage coverImage={coverImage} />
        <Greeting userName={userName} />
        <DateTimeDisplay />
        <SearchBar />
      </Container>

      <Container>
        <LinksGrid linksData={linksData} setLinksData={setLinksData} />
      </Container>
    </div>
  );
};

export default MainLayout;