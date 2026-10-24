
import { useMutation } from "@tanstack/react-query";

const CLIENT_ID =
  process.env.SPOTIFY_CLIENT_ID!;

const REDIRECT_URI = `${window.location.origin}/`;
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

const exchangeToken = async (
  code: string
): Promise<SpotifyTokenResponse> => {
  const codeVerifier = sessionStorage.getItem("code_verifier");

  if (!codeVerifier) {
    throw new Error("code_verifier not found. Please log in again.");
  }

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error_description ??
        data.error ??
        "Failed to exchange Spotify token"
    );
  }

  sessionStorage.setItem("access_token", data.access_token);
  sessionStorage.setItem(
    "expires_at",
    String(Date.now() + data.expires_in * 1000)
  );

  if (data.refresh_token) {
    sessionStorage.setItem("refresh_token", data.refresh_token);
  }

  sessionStorage.removeItem("code_verifier");

  return data as SpotifyTokenResponse;
};

export const useExchangeToken = () => {
  return useMutation({
    mutationFn: exchangeToken,
  });
};
