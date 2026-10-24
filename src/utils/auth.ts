
import { generateRandomString } from "./crypto";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;

const REDIRECT_URI =
  window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:3000/"
    : "https://until-loadingbar-wbz7-218p18cau-lovedubus-projects.vercel.app/";
    
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SCOPES = [
  "user-read-private",
  "user-read-email",
];

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);

  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input: ArrayBuffer): string => {
  return btoa(
    String.fromCharCode(...new Uint8Array(input))
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const getSpotifyAuthUrl = async (): Promise<string> => {
  const codeVerifier = generateRandomString(64);

  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  // Save the verifier for the next step of authentication.
  sessionStorage.setItem("code_verifier", codeVerifier);

const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    scope: SCOPES.join(" "),
  });

  console.log("Redirect URI:", REDIRECT_URI);

  return `${AUTH_ENDPOINT}?${params.toString()}`;
};
