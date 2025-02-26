import React, { useState, useEffect } from "react";
import Container from "../Container";
import CoverImage from "../CoverImage";
import Greeting from "../Greeting";
import SearchBar from "../SearchBar";
import LinksGrid from "../LinksGrid";
import DateTimeDisplay from "../DateTimeDisplay";
import SettingsPanel from "../SettingsPanel";
import { importFromGist } from "../../utilities/gistStorage";

const DEFAULT_IMAGE = "https://via.placeholder.com/1200x300";

const MainLayout = () => {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");
  const [coverImage, setCoverImage] = useState(localStorage.getItem("coverImage") || DEFAULT_IMAGE);
  const [linksData, setLinksData] = useState(JSON.parse(localStorage.getItem("linksData")) || []);
  const [githubToken, setGithubToken] = useState(localStorage.getItem("githubToken") || "");
  const [gistID, setGistID] = useState(localStorage.getItem("gistID") || "");

  useEffect(() => {
    // If GitHub sync is enabled, fetch data from the user's gist
    const fetchGitHubSettings = async () => {
      if (githubToken && gistID) {
        const githubSettings = await importFromGist(gistID);
        if (githubSettings) {
          setUserName(githubSettings.userName);
          setCoverImage(githubSettings.coverImage);
          setLinksData(githubSettings.linksData);
        }
      }
    };

    if (githubToken && gistID) {
      fetchGitHubSettings();
    } else {
      setUserName(localStorage.getItem("userName") || "User");
      setCoverImage(localStorage.getItem("coverImage") || DEFAULT_IMAGE);
      setLinksData(JSON.parse(localStorage.getItem("linksData")) || []);
    }
  }, [githubToken, gistID]);

  return (
    <div>
      <SettingsPanel
        userName={userName}
        setUserName={setUserName}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        linksData={linksData}
        setLinksData={setLinksData}
      />

      <Container>
        <CoverImage coverImage={coverImage} />
        <Greeting userName={userName} />
        <DateTimeDisplay />
        <SearchBar />
      </Container>

      <Container>
        <LinksGrid linksData={linksData} setLinksData={setLinksData} />
      </Container>
    </div>
  );
};

export default MainLayout;
