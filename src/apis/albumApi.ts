
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

console.log("API_BASE_URL:", API_BASE_URL);

export const getNewReleases = async () => {
  if (!API_BASE_URL) {
    throw new Error("REACT_APP_API_URL is missing");
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/new-releases`
  );

  return response.data;
};
