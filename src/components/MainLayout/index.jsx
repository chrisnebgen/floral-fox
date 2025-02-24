import React from 'react';
import Container from '../Container/index';
import CoverImage from '../CoverImage';
import Greeting from '../Greeting';
import SearchBar from '../SearchBar';
import LinksGrid from '../LinksGrid';
import DateTimeDisplay from '../DateTimeDisplay';
import styles from './styles.module.scss';

const MainLayout = () => {
  return (
    <div className={styles.main}>
      <Container>
        <CoverImage />
        <Greeting />
        <DateTimeDisplay />
        <SearchBar />
      </Container>
      <Container>
        <LinksGrid />
      </Container>
    </div>
  );
};

export default MainLayout;