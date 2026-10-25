
import axios from "axios";

export interface UserProfile {
  id: string;
  display_name: string | null;
  email?: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
  external_urls: {
    spotify: string;
  };
}

export const getCurrentUserProfile = async (
  accessToken: string
): Promise<UserProfile> => {
  const response = await axios.get<UserProfile>(
    "https://api.spotify.com/v1/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
