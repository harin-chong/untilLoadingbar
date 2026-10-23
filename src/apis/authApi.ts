
import axios from "axios";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const redirectUri = "http://127.0.0.1:3000/callback";

const encodedBase64 = (data: string): string => {
  return Buffer.from(data).toString("base64");
};

export const getClientCredentialToken = async (): Promise<string> => {
  try {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
    });

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      body,
      {
        headers: {
          Authorization: `Basic ${encodedBase64(
            `${clientId}:${clientSecret}`
          )}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Spotify token error:",
        error.response?.status,
        error.response?.data
      );
    }

    throw error;
  }
};
