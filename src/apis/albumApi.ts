import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Get new releases
export const getNewReleases = async () => {
  if (!API_BASE_URL) {
    throw new Error("REACT_APP_API_URL is missing");
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/new-releases`
  );

  return response.data;
};

// Get album details
export const getAlbumById = async (albumId: string) => {
  if (!API_BASE_URL) {
    throw new Error("REACT_APP_API_URL is missing");
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/albums/${albumId}`
  );

  return response.data;
};

export const getPopularTracks = async () => {
  if (!API_BASE_URL) {
    throw new Error("REACT_APP_API_URL is missing");
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/top-tracks`
  );

  return response.data;
};

export const getRecommendedAlbums = async () => {
  if (!API_BASE_URL) {
    throw new Error("REACT_APP_API_URL is missing");
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/recommended-albums`
  );

  return response.data;
};