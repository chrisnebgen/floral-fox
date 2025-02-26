import React, { useState, useEffect } from "react";
import { FaCog, FaTimes, FaFileImport, FaFileExport, FaGithub, FaSignOutAlt } from "react-icons/fa";
import { loginWithGitHub, getGitHubToken } from "../../utilities/githubAuth";
import { createOrUpdateGist, updateGist, importFromGist } from "../../utilities/gistStorage";
import styles from "./styles.module.scss";

const SettingsPanel = ({ userName, setUserName, coverImage, setCoverImage, linksData, setLinksData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [imageInput, setImageInput] = useState(coverImage);
  const [githubToken, setGithubToken] = useState(localStorage.getItem("githubToken") || "");
  const [gistID, setGistID] = useState(localStorage.getItem("gistID") || "");

  useEffect(() => {
    const token = getGitHubToken();
    if (token) {
      setGithubToken(token);
      localStorage.setItem("githubToken", token);
      window.history.replaceState({}, document.title, "/");
    }

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

  const exportSettings = async () => {
    const settings = {
      userName: localStorage.getItem("userName") || "User",
      coverImage: localStorage.getItem("coverImage") || "",
      linksData: JSON.parse(localStorage.getItem("linksData")) || [],
    };

    if (githubToken) {
      if (!gistID) {
        const newGistID = await createOrUpdateGist(settings);
        if (newGistID) {
          setGistID(newGistID);
          localStorage.setItem("gistID", newGistID);
        }
      } else {
        const success = await updateGist(gistID, settings);
        if (!success) {
          alert("Failed to update GitHub Sync. Ensure the Gist exists or re-sync.");
        }
      }
    } else {
      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "user-settings.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        if (!importedSettings.userName || !importedSettings.coverImage || !Array.isArray(importedSettings.linksData)) {
          alert("Invalid JSON format. Ensure the file is correctly structured.");
          return;
        }

        if (window.confirm("Importing these settings will overwrite your current settings. Do you want to continue?")) {
          localStorage.setItem("userName", importedSettings.userName);
          localStorage.setItem("coverImage", importedSettings.coverImage);
          localStorage.setItem("linksData", JSON.stringify(importedSettings.linksData));

          setUserName(importedSettings.userName);
          setCoverImage(importedSettings.coverImage);
          setLinksData(importedSettings.linksData);
        }
      } catch (error) {
        alert("Error reading settings file.");
      }
    };

    reader.readAsText(file);
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
    setGithubToken("");
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
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={() => setIsOpen(false)}>Cancel</button>
          <button className={styles.saveButton} onClick={saveSettings}>Save Settings</button>
        </div>

        <div className={styles.importExportContainer}>
          <button className={styles.exportButton} onClick={exportSettings}><FaFileExport /> Export</button>
          <label className={styles.importButton}><FaFileImport /> Import<input type="file" accept=".json" onChange={importSettings} /></label>
          <button className={styles.syncButton} onClick={githubToken ? exportSettings : loginWithGitHub}>
            <FaGithub /> {githubToken ? "Update GitHub Sync" : "Sync with GitHub"}
          </button>
          {githubToken && (
            <button className={styles.logoutButton} onClick={logoutGitHub}>
              <FaSignOutAlt /> Logout GitHub
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
