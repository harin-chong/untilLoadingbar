
import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import {
  getPlaylistById,
  type PlaylistDetail,
} from "../../apis/playlistApi";

interface LayoutContext {
  accessToken: string | null;
}

const PlaylistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useOutletContext<LayoutContext>();

  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !id) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchPlaylist = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getPlaylistById(accessToken, id);

        if (!cancelled) {
          setPlaylist(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load playlist."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchPlaylist();

    return () => {
      cancelled = true;
    };
  }, [accessToken, id]);

  if (!accessToken) {
    return (
      <Typography sx={{ p: 3 }}>
        Please log in to view this playlist.
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 3 }}>
        {error}
      </Typography>
    );
  }

  if (!playlist) {
    return (
      <Typography sx={{ p: 3 }}>
        Playlist not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Playlist header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          gap: 3,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        {playlist.images[0]?.url && (
          <Box
            component="img"
            src={playlist.images[0].url}
            alt={playlist.name}
            sx={{
              width: { xs: 160, md: 220 },
              height: { xs: 160, md: 220 },
              objectFit: "cover",
              borderRadius: 1,
              boxShadow: 3,
            }}
          />
        )}

        <Box>
          <Typography variant="body2">
            Public Playlist
          </Typography>

          <Typography
            variant="h2"
            fontWeight={700}
            sx={{ my: 1, overflowWrap: "anywhere" }}
          >
            {playlist.name}
          </Typography>

          {playlist.description && (
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {playlist.description}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary">
            {playlist.items.total} songs
          </Typography>
        </Box>
      </Box>

      {/* Track list */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Tracks
      </Typography>

      {playlist.items.items.map((entry, index) => {
        const track = entry.item;

        if (!track) return null;

        return (
          <Box
            key={`${track.id}-${index}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <Typography
              color="text.secondary"
              sx={{ width: 24, textAlign: "center" }}
            >
              {index + 1}
            </Typography>

            {track.album.images[0]?.url && (
              <Box
                component="img"
                src={track.album.images[0].url}
                alt={track.album.name}
                sx={{
                  width: 48,
                  height: 48,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            )}

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography noWrap fontWeight={500}>
                {track.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
              >
                {track.artists
                  .map((artist) => artist.name)
                  .join(", ")}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ flexShrink: 0 }}
            >
              {Math.floor(track.duration_ms / 60000)}:
              {String(
                Math.floor((track.duration_ms % 60000) / 1000)
              ).padStart(2, "0")}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default PlaylistDetailPage;
