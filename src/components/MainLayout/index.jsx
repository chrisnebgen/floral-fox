import React, { useState, useEffect } from 'react';
import tinycolor from 'tinycolor2';
import Container from '../Container';
import CoverImage from '../CoverImage';
import Greeting from '../Greeting';
import SearchBar from '../SearchBar';
import LinksGrid from '../LinksGrid';
import DateTimeDisplay from '../DateTimeDisplay';
import ThemeModal from '../ThemeModal';
import SettingsPanel from '../SettingsPanel';
import styles from './styles.module.scss';

const DEFAULT_IMAGE = 'https://via.placeholder.com/1200x300?text=Default+Cover+Image';

const defaultThemeColors = {
  'background-color': '#B0B0B2',
  'heading-color': '#33301F',
  'font-color': '#DFDFE1',
  'primary-color': '#ACAAB3',
  'accent-color': '#E69D36'
};

const MainLayout = () => {
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'User');
  const [coverImage, setCoverImage] = useState(() => localStorage.getItem('coverImage') || DEFAULT_IMAGE);
  const [linksData, setLinksData] = useState(() => JSON.parse(localStorage.getItem('linksData')) || []);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [themeColors, setThemeColors] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('themeColors'));
    return { ...defaultThemeColors, ...stored };
  });

  useEffect(() => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('coverImage', coverImage);
    localStorage.setItem('linksData', JSON.stringify(linksData));
    localStorage.setItem('themeColors', JSON.stringify(themeColors));
  }, [userName, coverImage, linksData, themeColors]);

  /**
   * Use tinycolor2 to add darker and lighter options for chosen colors.
   */
  useEffect(() => {
    Object.entries(themeColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);

      const base = tinycolor(value);
      if (base.isValid()) {
        const darker = base.darken(10).toString();
        const lighter = base.lighten(10).toString();
        document.documentElement.style.setProperty(`--${key}-darker`, darker);
        document.documentElement.style.setProperty(`--${key}-lighter`, lighter);
      }
    });
  }, [themeColors]);

  return (
    <main className={styles.main}>
      <SettingsPanel
        userName={userName}
        setUserName={setUserName}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        linksData={linksData}
        setLinksData={setLinksData}
        themeColors={themeColors}
        setThemeColors={setThemeColors}
        openThemeModal={() => setThemeModalOpen(true)}
      />
      <ThemeModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        themeColors={themeColors}
        setThemeColors={setThemeColors}
      />

      <Container aria-labelledby="greeting-search">
        <CoverImage coverImage={coverImage} />
        <Greeting userName={userName} />
        <DateTimeDisplay />
        <SearchBar />
      </Container>

      <Container aria-labelledby="links-area">
        <LinksGrid linksData={linksData} setLinksData={setLinksData} />
      </Container>
    </main>
  );
};

export default MainLayout;