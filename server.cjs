
require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

let cachedToken = null;
let tokenExpiresAt = 0;

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://until-loadingbar-wbz7.vercel.app",
  "https://until-loadingbar-wbz7-218p18cau-lovedubus-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/until-loadingbar-wbz7-[a-z0-9]+-lovedubus-projects\.vercel\.app$/.test(
          origin
        );

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
  })
);

app.use(express.json());

// ========================================
// Spotify Client Credentials Token
// ========================================

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

// ========================================
// Get New Releases
// ========================================

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
      "Spotify album API error:",
      error.response?.status,
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.error?.message ||
        "Failed to fetch albums",
    });
  }
});

// ========================================
// Search Tracks
// ========================================

app.get("/api/search", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const token = await getSpotifyToken();

    const response = await axios.get(
      "https://api.spotify.com/v1/search",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: "track",
          limit: 10,
        },
      }
    );

    // Returns { items: [...] }
    res.json(response.data.tracks);
  } catch (error) {
    console.error(
      "Spotify track search error:",
      error.response?.status,
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.error?.message ||
        "Failed to search tracks",
    });
  }
});

// ========================================
// Get Album Details and Tracks
// ========================================

app.get("/api/albums/:id", async (req, res) => {
  try {
    const albumId = req.params.id;
    const token = await getSpotifyToken();

    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Spotify album detail error:",
      error.response?.status,
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.error?.message ||
        "Failed to fetch album details",
    });
  }
});

// ========================================
// Health Check
// ========================================

app.get("/", (req, res) => {
  res.send("Spotify API server is running");
});

// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {
  console.log(`Spotify API server running on port ${PORT}`);
});
