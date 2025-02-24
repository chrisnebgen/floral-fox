import React from 'react';
import styles from './styles.module.scss';

const getGreeting = () => {
  const name = "User";
  const hours = new Date().getHours();
  let greeting = "Hello there.";

  if ( hours >= 0 && hours < 8) greeting = `Good Morning, ${name}`;
  else if ( hours >= 8 && hours < 12) greeting = `Good Aftermorning, ${name}`;
  else if ( hours >= 12 && hours < 18 ) greeting = `Good Afternoon, ${name}`;
  else if ( hours >= 18 && hours < 22) greeting = `Good Evening, ${name}`;
  else greeting = `It's Late Evening, ${name}`;

  return greeting;
};

const Greeting = () => {
  return (
    <div className={styles.greetingContainer}>
      <h2 className={styles.greetingMessage}>{getGreeting()}</h2>
    </div>
  );
};

export default Greeting;