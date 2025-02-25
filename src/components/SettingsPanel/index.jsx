import React, { useState, useEffect } from 'react';
import { FaCog, FaTimes } from 'react-icons/fa';
import styles from './styles.module.scss';

const SettingsPanel = ({ userName, setUserName, coverImage, setCoverImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [imageInput, setImageInput] = useState(coverImage);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedImage = localStorage.getItem('coverImage');
    if (savedName) setUserName(savedName);
    if (savedImage) setCoverImage(savedImage);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('userName', nameInput);
    localStorage.setItem('coverImage', imageInput);
    setUserName(nameInput);
    setCoverImage(imageInput);
    setIsOpen(false);
  };

  const cancelChanges = () => {
    setNameInput(userName);
    setImageInput(coverImage);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={`${styles.settingsButton} ${isOpen ? styles.hidden : ''}`}
        title="Settings"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <FaCog />
      </button>

      <div className={`${styles.settingsPanel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.settingsHeader}>
          <h2 className={styles.settingsTitle}>Settings</h2>
          <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.settingsContent}>
          <div className={styles.settingsForm}>
            <label className={styles.settingsLabel}>Name:</label>
            <input
              type="text"
              className={styles.settingsInput}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />

            <label className={styles.settingsLabel}>Cover Image URL:</label>
            <input
              type="text"
              className={styles.settingsInput}
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
            />
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.cancelButton} onClick={cancelChanges}>Cancel</button>
            <button className={styles.saveButton} onClick={saveSettings}>Save Settings</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
