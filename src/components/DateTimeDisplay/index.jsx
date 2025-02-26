import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

const DateTimeDisplay = () => {
  const [ dateTime, setDateTime ] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const timeZone = Intl.DateTimeFormat(undefined, { timeZoneName: 'short'})
      .formatToParts(date)
      .find((part) => part.type === `timeZoneName`)?.value;

    return `${hours}:${minutes}:${seconds} ${timeZone}`;
  };

  return (
    <div className={ styles.dateTime }>
      {formatTime(dateTime)}
    </div>
  );
};

export default DateTimeDisplay;