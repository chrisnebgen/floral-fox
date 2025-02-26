const GITHUB_API_URL = "https://api.github.com";
const GIST_FILENAME = "custom-start-user-settings.json";

/**
 * Fetches all Gists for the authenticated user and finds an existing settings Gist.
 * @returns {Array} A list of existing Gists matching the description.
 */
export const getUserGists = async () => {
  const token = localStorage.getItem("githubToken");
  if (!token) return [];

  try {
    const response = await fetch(`${GITHUB_API_URL}/gists`, {
      headers: { Authorization: `token ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch Gists");

    const gists = await response.json();
    return gists.filter((gist) => gist.description === "User settings backup for Custom Start Page");
  } catch (error) {
    console.error("Error fetching user Gists:", error);
    return [];
  }
};

/**
 * Creates a new GitHub Gist with user settings or updates an existing one.
 * @param {Object} settings - The settings to save.
 * @returns {string|null} The Gist ID if successful, null otherwise.
 */
export const createOrUpdateGist = async (settings) => {
  const token = localStorage.getItem("githubToken");
  if (!token) return alert("GitHub authentication required."), null;

  const existingGists = await getUserGists();
  if (existingGists.length > 0) {
    const existingGistID = existingGists[0].id;
    console.log("Existing Gist found. Updating instead.");
    return (await updateGist(existingGistID, settings)) ? existingGistID : null;
  }

  try {
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
  const token = localStorage.getItem("githubToken");
  if (!token) {
    alert("GitHub authentication required.");
    return false;
  }

  try {
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
 * Logs out from GitHub Sync by removing token and Gist ID from localStorage.
 */
export const logoutGitHub = () => {
  localStorage.removeItem("githubToken");
  localStorage.removeItem("gistID");
  alert("You have logged out of GitHub Sync.");
};