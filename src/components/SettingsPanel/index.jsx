import React, { useState, useEffect } from 'react';
import { FaCog, FaTimes, FaFileImport, FaFileExport } from 'react-icons/fa';
import styles from './styles.module.scss';

const SettingsPanel = ({ userName, setUserName, coverImage, setCoverImage, linksData, setLinksData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [imageInput, setImageInput] = useState(coverImage);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedImage = localStorage.getItem('coverImage');
    const savedLinks = JSON.parse(localStorage.getItem('linksData')) || [];

    if (savedName) setUserName(savedName);
    if (savedImage) setCoverImage(savedImage);
    if (savedLinks.length > 0) setLinksData(savedLinks);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('userName', nameInput);
    localStorage.setItem('coverImage', imageInput);
    localStorage.setItem('linksData', JSON.stringify(linksData));
    setUserName(nameInput);
    setCoverImage(imageInput);
    setIsOpen(false);
  };

  const exportSettings = () => {
    const settings = {
      userName: localStorage.getItem('userName') || 'User',
      coverImage: localStorage.getItem('coverImage') || '',
      linksData: JSON.parse(localStorage.getItem('linksData')) || [],
    };
  
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
  
        // Validate the imported data
        if (
          !importedSettings.userName ||
          !importedSettings.coverImage ||
          !Array.isArray(importedSettings.linksData)
        ) {
          alert('Invalid settings file.');
          return;
        }
  
        // Retrieve current settings from localStorage
        const currentSettings = {
          userName: localStorage.getItem('userName') || 'User',
          coverImage: localStorage.getItem('coverImage') || '',
          linksData: JSON.parse(localStorage.getItem('linksData')) || [],
        };
  
        // Compare the two states
        const isDifferent =
          JSON.stringify(currentSettings) !== JSON.stringify(importedSettings);
  
        if (isDifferent) {
          const confirmImport = window.confirm(
            'Importing these settings will overwrite your current settings. Do you want to continue?'
          );
  
          if (!confirmImport) return;
        }
  
        // Apply the new settings upon confirmation
        localStorage.setItem('userName', importedSettings.userName);
        localStorage.setItem('coverImage', importedSettings.coverImage);
        localStorage.setItem('linksData', JSON.stringify(importedSettings.linksData));
  
        // Update state to trigger refresh in components
        setUserName(importedSettings.userName);
        setCoverImage(importedSettings.coverImage);
        setLinksData(importedSettings.linksData);
  
      } catch (error) {
        alert('Error reading settings file.');
      }
    };
  
    reader.readAsText(file);
  };

  return (
    <>
      <button className={`${styles.settingsButton} ${isOpen ? styles.hidden : ''}`} onClick={() => setIsOpen(true)}>
        <FaCog />
      </button>

      <div className={`${styles.settingsPanel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.settingsHeader}>
          <h2 className={styles.settingsTitle}>Settings</h2>
          <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.settingsForm}>
          <label className={styles.settingsLabel}>Name:</label>
          <input type="text" className={styles.settingsInput} value={nameInput} onChange={(e) => setNameInput(e.target.value)} />

          <label className={styles.settingsLabel}>Cover Image URL:</label>
          <input type="text" className={styles.settingsInput} value={imageInput} onChange={(e) => setImageInput(e.target.value)} />
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={() => setIsOpen(false)}>Cancel</button>
          <button className={styles.saveButton} onClick={saveSettings}>Save Settings</button>
        </div>

        <div className={styles.importExportContainer}>
          <button className={styles.exportButton} onClick={exportSettings}>
            <FaFileExport /> Export Settings
          </button>
          <label className={styles.importButton}>
            <FaFileImport /> Import Settings
            <input type="file" accept=".json" onChange={importSettings} />
          </label>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
