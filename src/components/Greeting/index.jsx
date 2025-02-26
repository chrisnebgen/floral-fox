import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

const getGreeting = (name) => {
  const hours = new Date().getHours();

  // Greetings based upon hour
  if (hours >= 0 && hours < 8) return `Good Morning, ${name}`;
  if (hours >= 8 && hours < 12) return `Good Aftermorning, ${name}`;
  if (hours >= 12 && hours < 18) return `Good Afternoon, ${name}`;
  if (hours >= 18 && hours < 22) return `Good Evening, ${name}`;
  
  return `It's Late Evening, ${name}`;
};

const Greeting = ({ userName }) => {
  const [greeting, setGreeting] = useState(getGreeting(userName));

  useEffect(() => {
    setGreeting(getGreeting(userName));
  }, [userName]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting(userName));
    }, 3600000);

    return () => clearInterval(interval);
  }, [userName]);

  return (
    <div className={styles.greetingContainer}>
      <h2 className={styles.greetingMessage}>{greeting}</h2>
    </div>
  );
};

export default Greeting;