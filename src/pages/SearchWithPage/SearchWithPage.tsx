import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";

interface OutletContext {
  accessToken: string | null;
}

interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  artists: { id: string; name: string }[];
  album: {
    name: string;
    images: { url: string; width: number | null; height: number | null }[];
  };
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const SearchWithPage = () => {
  const { keyword = "" } = useParams<{ keyword: string }>();
  const { accessToken } = useOutletContext<OutletContext>();

  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !keyword) {
      setTracks([]);
      return;
    }

    const controller = new AbortController();

    const searchTracks = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: keyword,
          type: "track",
          limit: "10",
        });

        const response = await fetch(
          `https://api.spotify.com/v1/search?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          },
        );

        const responseData = await response.json();

        if (!response.ok) {
          console.error("Spotify error message:", responseData.error?.message);

          console.error(
            "Spotify full error:",
            JSON.stringify(responseData, null, 2),
          );

          throw new Error(
            responseData.error?.message ??
              `Spotify API request failed (${response.status})`,
          );
        }
        const data: SpotifySearchResponse = responseData;
        setTracks(data.tracks.items);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void searchTracks();

    return () => controller.abort();
  }, [accessToken, keyword]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, color: "white" }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Search results
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Results for "{keyword}"
      </Typography>

      {!accessToken && (
        <Alert severity="info">Log in to Spotify to search for tracks.</Alert>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && accessToken && tracks.length === 0 && (
        <Typography color="text.secondary">No tracks found.</Typography>
      )}

      {!loading && tracks.length > 0 && (
        <List>
          {tracks.map((track) => (
            <ListItem
              key={track.id}
              sx={{
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  src={track.album.images[track.album.images.length - 1]?.url}
                  alt={track.album.name}
                  sx={{ width: 48, height: 48, mr: 1 }}
                />
              </ListItemAvatar>

              <ListItemText
                primary={track.name}
                secondary={`${track.artists
                  .map((artist) => artist.name)
                  .join(", ")} · ${track.album.name}`}
                slotProps={{
                  primary: {
                    sx: {
                      color: "white",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  },
                  secondary: {
                    sx: {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  },
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 2, flexShrink: 0 }}
              >
                {formatDuration(track.duration_ms)}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchWithPage;
