
import axios from "axios";

export const getNewReleases = async () => {
  const response = await axios.get(
    "http://localhost:4000/api/new-releases"
  );

  return response.data;
};
