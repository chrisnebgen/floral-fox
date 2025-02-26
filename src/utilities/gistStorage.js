const GITHUB_API_URL = "https://api.github.com";
const GIST_FILENAME = "custom-start-user-settings.json";

/**
 * Retrieves the GitHub token from localStorage.
 * @returns {string|null} The GitHub token, or null if missing.
 */
const getGitHubToken = () => {
  const token = localStorage.getItem("githubToken");
  if (!token) {
    alert("GitHub authentication required. Please log in.");
    throw new Error("GitHub token is missing.");
  }
  return token;
};

/**
 * Fetches all Gists for the authenticated user and finds an existing settings Gist.
 * @returns {Object|null} The existing Gist object if found, otherwise null.
 */
export const getUserSettingsGist = async () => {
  try {
    const token = getGitHubToken();
    const response = await fetch(`${GITHUB_API_URL}/gists`, {
      headers: { Authorization: `token ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch user Gists");

    const gists = await response.json();
    return gists.find((gist) => gist.description === "User settings backup for Custom Start Page") || null;
  } catch (error) {
    console.error("Error fetching user Gists:", error);
    return null;
  }
};

/**
 * Creates a new GitHub Gist with user settings.
 * @param {Object} settings - The settings to save.
 * @returns {string|null} The Gist ID if successful, null otherwise.
 */
export const createGist = async (settings) => {
  try {
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
        files: {
          [GIST_FILENAME]: { content: JSON.stringify(settings, null, 2) },
        },
      }),
    });

    if (!response.ok) throw new Error("Failed to create Gist");

    const data = await response.json();
    localStorage.setItem("gistID", data.id);
    return data.id;
  } catch (error) {
    console.error("Error creating Gist:", error);
    return null;
  }
};

/**
 * Updates an existing GitHub Gist with new settings.
 * @param {string} gistID - The Gist ID to update.
 * @param {Object} settings - The settings to update.
 * @returns {boolean} True if successful, false otherwise.
 */
export const updateGist = async (gistID, settings) => {
  try {
    const token = getGitHubToken();

    const response = await fetch(`${GITHUB_API_URL}/gists/${gistID}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: "User settings backup for Custom Start Page",
        files: {
          [GIST_FILENAME]: { content: JSON.stringify(settings, null, 2) },
        },
      }),
    });

    if (!response.ok) throw new Error("Failed to update Gist");

    return true;
  } catch (error) {
    console.error("Error updating Gist:", error);
    return false;
  }
};

/**
 * Creates a new Gist or updates an existing one with user settings.
 * @param {Object} settings - The settings to save.
 * @returns {string|null} The Gist ID if successful, null otherwise.
 */
export const syncGist = async (settings) => {
  try {
    let gist = await getUserSettingsGist();
    if (gist) {
      console.log("Existing Gist found. Updating instead of creating a new one.");
      return (await updateGist(gist.id, settings)) ? gist.id : null;
    } else {
      return await createGist(settings);
    }
  } catch (error) {
    console.error("Error syncing settings to Gist:", error);
    return null;
  }
};

/**
 * Imports settings from a GitHub Gist.
 * @param {string} gistID - The Gist ID to fetch.
 * @returns {Object|null} The imported settings if successful, null otherwise.
 */
export const importFromGist = async (gistID) => {
  try {
    const response = await fetch(`${GITHUB_API_URL}/gists/${gistID}`);
    if (!response.ok) throw new Error("Failed to fetch Gist");

    const data = await response.json();
    const content = data.files[GIST_FILENAME]?.content;

    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("Error importing from Gist:", error);
    return null;
  }
};

/**
 * Logs out from GitHub Sync by removing the token and Gist ID from localStorage.
 */
export const logoutGitHub = () => {
  localStorage.removeItem("githubToken");
  localStorage.removeItem("gistID");
  alert("You have logged out of GitHub Sync.");
};
