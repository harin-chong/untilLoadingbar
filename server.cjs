
require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

let cachedToken = null;
let tokenExpiresAt = 0;

const app = express();
const PORT = process.env.PORT || 4000;

// 로컬 개발 및 Vercel 프론트엔드 허용
const allowedOrigins = [
  "http://localhost:3000",
  "https://until-loadingbar-wbz7.vercel.app",
  "https://until-loadingbar-wbz7-kusptyyx3-lovedubus-projects.vercel.app",
  "https://until-loadingbar-wbz7-7zlfih0ng-lovedubus-projects.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Spotify access token 발급 및 캐싱
async function getSpotifyToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "client_credentials",
    }),
    {
      auth: {
        username: process.env.SPOTIFY_CLIENT_ID,
        password: process.env.SPOTIFY_CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiresAt =
    Date.now() + response.data.expires_in * 1000 - 60000;

  return cachedToken;
}

// 앨범 데이터 가져오기
app.get("/api/new-releases", async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const offsets = [0, 10, 20];

    const responses = await Promise.all(
      offsets.map((offset) =>
        axios.get("https://api.spotify.com/v1/search", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: "year:2026",
            type: "album",
            limit: 10,
            offset,
          },
        })
      )
    );

    const albums = responses.flatMap(
      (response) => response.data.albums.items
    );

    res.json(albums);
  } catch (error) {
    console.error(
      "Spotify API error:",
      error.response?.status,
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Failed to fetch albums",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Spotify API server running on port ${PORT}`);
});
