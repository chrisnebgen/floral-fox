const CLIENT_ID = "Ov23liDCUszbUuQWczlN";
const REDIRECT_URI = "https://chrisnebgen.github.io/floral-fox/";

/**
 * Initiates GitHub OAuth authentication.
 */
export const loginWithGitHub = () => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=gist`;
  window.location.href = authUrl;
};

/**
 * Extracts the GitHub OAuth token from the URL after login.
 */
export const getGitHubToken = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
};