const GITHUB_API_URL = "https://api.github.com";
const GIST_FILENAME = "custom-start-user-settings.json";

/**
 * Retrieves the stored GitHub PAT.
 */
const getGitHubToken = () => localStorage.getItem("githubToken");

/**
 * Fetches user's existing settings Gist.
 */
export const getUserSettingsGist = async () => {
  try {
    const token = getGitHubToken();
    if (!token) throw new Error("GitHub PAT missing");

    const response = await fetch(`${GITHUB_API_URL}/gists`, {
      headers: { Authorization: `token ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch Gists");

    const gists = await response.json();
    return gists.find((gist) => gist.description === "User settings backup for Custom Start Page") || null;
  } catch (error) {
    console.error("Error fetching user Gists:", error);
    return null;
  }
};

/**
 * Creates or updates a settings Gist.
 */
export const createOrUpdateGist = async (settings) => {
  try {
    let gist = await getUserSettingsGist();
    if (gist) return (await updateGist(gist.id, settings)) ? gist.id : null;

    const token = getGitHubToken();
    const response = await fetch(`${GITHUB_API_URL}/gists`, {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: "User settings backup for Custom Start Page",
        public: false,
        files: { [GIST_FILENAME]: { content: JSON.stringify(settings, null, 2) } },
      }),
    });

    if (!response.ok) throw new Error("Failed to create Gist");

    const data = await response.json();
    localStorage.setItem("gistID", data.id);
    return data.id;
  } catch (error) {
    console.error("Error creating/updating Gist:", error);
    return null;
  }
};
