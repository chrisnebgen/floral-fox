import React, { useState, useEffect, useCallback } from 'react';
import { FaCog, FaTimes, FaFileImport, FaFileExport } from 'react-icons/fa';
import styles from './styles.module.scss';

const SettingsPanel = ({
  userName,
  setUserName,
  coverImage,
  setCoverImage,
  linksData,
  setLinksData,
  themeColors,
  setThemeColors,
  openThemeModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [imageInput, setImageInput] = useState(coverImage);

  useEffect(() => {
    setNameInput(userName);
    setImageInput(coverImage);
  }, [userName, coverImage]);

  const saveSettings = () => {
    localStorage.setItem('userName', nameInput);
    localStorage.setItem('coverImage', imageInput);
    localStorage.setItem('linksData', JSON.stringify(linksData));
    localStorage.setItem('themeColors', JSON.stringify(themeColors));
    setUserName(nameInput);
    setCoverImage(imageInput);
    setIsOpen(false);
    alert('Settings saved successfully!');
  };

  const exportSettings = useCallback(() => {
    const settings = {
      userName: localStorage.getItem('userName') || 'User',
      coverImage: localStorage.getItem('coverImage') || '',
      linksData: JSON.parse(localStorage.getItem('linksData')) || [],
      themeColors: JSON.parse(localStorage.getItem('themeColors')) || {},
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const importSettings = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);

        if (
          typeof importedSettings.userName !== 'string' ||
          typeof importedSettings.coverImage !== 'string' ||
          !Array.isArray(importedSettings.linksData)
        ) {
          alert('Invalid settings file format.');
          return;
        }

        const confirmImport = window.confirm('Importing will overwrite your settings. Do you want to continue?');
        if (!confirmImport) return;

        localStorage.setItem('userName', importedSettings.userName);
        localStorage.setItem('coverImage', importedSettings.coverImage);
        localStorage.setItem('linksData', JSON.stringify(importedSettings.linksData));

        if (typeof importedSettings.themeColors === 'object') {
          localStorage.setItem('themeColors', JSON.stringify(importedSettings.themeColors));
          setThemeColors(importedSettings.themeColors);
        }

        setUserName(importedSettings.userName);
        setCoverImage(importedSettings.coverImage);
        setLinksData(importedSettings.linksData);
        setNameInput(importedSettings.userName);
        setImageInput(importedSettings.coverImage);

        alert('Settings imported successfully!');
      } catch (error) {
        alert('Error reading settings file.');
      }
    };

    reader.readAsText(file);
  }, [setUserName, setCoverImage, setLinksData, setThemeColors]);

  const isDisabled = nameInput === userName && imageInput === coverImage;

  return (
    <>
      <button
        className={`${styles.settingsButton} ${isOpen ? styles.hidden : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open Settings"
        title="Open Settings"
      >
        <FaCog />
      </button>

      <div className={`${styles.settingsPanel} ${isOpen ? styles.open : ''}`} role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className={styles.settingsHeader}>
          <h2 id="settings-title" className={styles.settingsTitle}>Settings</h2>
          <button className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label="Close Settings" title="Close">
            <FaTimes />
          </button>
        </div>

        <form
          className={styles.settingsForm}
          onSubmit={(e) => {
            e.preventDefault();
            saveSettings();
          }}
        >
          <label className={styles.settingsLabel} htmlFor="user-name">Name:</label>
          <input
            id="user-name"
            type="text"
            className={styles.settingsInput}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />

          <label className={styles.settingsLabel} htmlFor="cover-image">Cover Image URL:</label>
          <input
            id="cover-image"
            type="text"
            className={styles.settingsInput}
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
          />
        </form>

        <div className={styles.themeButtonContainer}>
          <button className={styles.exportButton} onClick={openThemeModal}>
            Customize Theme
          </button>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={() => setIsOpen(false)}>Cancel</button>
          <button className={styles.saveButton} onClick={saveSettings} disabled={isDisabled}>Save Settings</button>
        </div>

        <div className={styles.importExportContainer}>
          <button className={styles.exportButton} onClick={exportSettings}>
            <FaFileExport /> Export Settings
          </button>
          <label className={styles.importButton}>
            <FaFileImport /> Import Settings
            <input
              type="file"
              accept=".json"
              onChange={(event) => {
                importSettings(event);
                event.target.value = '';
              }}
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
