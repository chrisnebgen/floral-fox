import React, { useState, useEffect } from "react";
import { FaCog, FaTimes, FaFileImport, FaFileExport, FaGithub, FaSignOutAlt, FaKey } from "react-icons/fa";
import { createOrUpdateGist, importFromGist } from "../../utilities/gistStorage";
import styles from "./styles.module.scss";

const SettingsPanel = ({ userName, setUserName, coverImage, setCoverImage, linksData, setLinksData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [imageInput, setImageInput] = useState(coverImage);
  const [githubToken, setGithubToken] = useState(localStorage.getItem("githubToken") || "");
  const [gistID, setGistID] = useState(localStorage.getItem("gistID") || "");

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedImage = localStorage.getItem("coverImage");
    const savedLinks = JSON.parse(localStorage.getItem("linksData")) || [];

    if (savedName) setUserName(savedName);
    if (savedImage) setCoverImage(savedImage);
    if (savedLinks.length > 0) setLinksData(savedLinks);
  }, []);

  const saveSettings = () => {
    localStorage.setItem("userName", nameInput);
    localStorage.setItem("coverImage", imageInput);
    localStorage.setItem("linksData", JSON.stringify(linksData));
    setUserName(nameInput);
    setCoverImage(imageInput);
    setIsOpen(false);
  };

  const saveGitHubToken = () => {
    localStorage.setItem("githubToken", githubToken);
    alert("GitHub PAT saved successfully!");
  };

  const exportSettings = async () => {
    if (!githubToken) {
      alert("Enter your GitHub PAT first!");
      return;
    }

    const settings = {
      userName: localStorage.getItem("userName") || "User",
      coverImage: localStorage.getItem("coverImage") || "",
      linksData: JSON.parse(localStorage.getItem("linksData")) || [],
    };

    const newGistID = await createOrUpdateGist(settings);
    if (newGistID) {
      setGistID(newGistID);
      localStorage.setItem("gistID", newGistID);
    }
  };

  const importFromGistHandler = async () => {
    if (!gistID) {
      alert("No Gist ID found. Please sync settings first.");
      return;
    }

    const importedSettings = await importFromGist(gistID);
    if (!importedSettings) {
      alert("Failed to import settings from Gist. Ensure the Gist ID is correct.");
      return;
    }

    localStorage.setItem("userName", importedSettings.userName);
    localStorage.setItem("coverImage", importedSettings.coverImage);
    localStorage.setItem("linksData", JSON.stringify(importedSettings.linksData));

    setUserName(importedSettings.userName);
    setCoverImage(importedSettings.coverImage);
    setLinksData(importedSettings.linksData);
  };

  const logoutGitHub = () => {
    localStorage.removeItem("githubToken");
    localStorage.removeItem("gistID");
    setGithubToken("");
    setGistID("");
    alert("You have logged out of GitHub Sync.");
  };

  return (
    <>
      <button className={`${styles.settingsButton} ${isOpen ? styles.hidden : ""}`} onClick={() => setIsOpen(true)}>
        <FaCog />
      </button>

      <div className={`${styles.settingsPanel} ${isOpen ? styles.open : ""}`}>
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

          <label className={styles.settingsLabel}>GitHub Personal Access Token (PAT):</label>
          <input type="text" className={styles.settingsInput} value={githubToken} onChange={(e) => setGithubToken(e.target.value)} />
          <button className={styles.saveButton} onClick={saveGitHubToken}><FaKey /> Save GitHub Token</button>
        </div>

        <div className={styles.importExportContainer}>
          <button className={styles.exportButton} onClick={exportSettings}><FaFileExport /> Export</button>
          <button className={styles.importButton} onClick={importFromGistHandler}><FaFileImport /> Import from GitHub</button>
          {githubToken && <button className={styles.logoutButton} onClick={logoutGitHub}><FaSignOutAlt /> Logout GitHub</button>}
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;