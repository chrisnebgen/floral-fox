import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

const DateTimeDisplay = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    let animationFrame;

    const updateDateTime = () => {
      setDateTime(new Date());
      animationFrame = requestAnimationFrame(updateDateTime);
    };

    animationFrame = requestAnimationFrame(updateDateTime);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const timeZone = Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value;

    return `${hours}:${minutes}:${seconds} ${timeZone}`;
  };

  return (
    <div className={styles.dateTime} role="status" aria-live="polite">
      <span className="visually-hidden">Current time: </span>
      <time dateTime={dateTime.toISOString()}>{formatTime(dateTime)}</time>
    </div>
  );
};

export default DateTimeDisplay;