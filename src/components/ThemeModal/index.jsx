import React, { useEffect, useState, useCallback } from 'react';
import styles from './styles.module.scss';
import { FaTimes, FaFileImport, FaFileExport } from 'react-icons/fa';

const ThemeModal = ({ isOpen, onClose, themeColors, setThemeColors }) => {
  const [pendingColors, setPendingColors] = useState(themeColors);

  useEffect(() => {
    if (isOpen) {
      setPendingColors(themeColors);
    }
  }, [isOpen, themeColors]);

  const handleColorChange = (key, value) => {
    setPendingColors(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('themeColors', JSON.stringify(pendingColors));
    setThemeColors(pendingColors);
    onClose();
  };

  const hasChanges = JSON.stringify(pendingColors) !== JSON.stringify(themeColors);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Customize Theme</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.content}>
          {Object.entries(pendingColors).map(([key, value]) => (
            <div key={key} className={styles.colorRow}>
              <label>
                {key.replace(/-color/, '').replace(/(^|-)(\w)/g, (_, __, l) => ' ' + l.toUpperCase()).trim()}
              </label>
              <input
                type="color"
                value={value}
                onChange={(e) => handleColorChange(key, e.target.value)}
              />
            </div>
          ))}

          {hasChanges && (
            <div className={styles.unsaved}>You have unsaved changes.</div>
          )}

          <div className={styles.footer}>
            <button className={styles.cancel} onClick={onClose}>Cancel</button>
            <button className={styles.save} onClick={handleSave} disabled={!hasChanges}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeModal;
