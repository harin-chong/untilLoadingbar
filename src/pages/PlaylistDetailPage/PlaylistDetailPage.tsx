import { useEffect, useState } from "react";
import { useParams, useOutletContext, useLocation } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { getPlaylistById, type PlaylistDetail } from "../../apis/playlistApi";

interface OutletContext {
  accessToken: string | null;
}

function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useOutletContext<OutletContext>();

  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  const selectedTrack = location.state?.track;
  useEffect(() => {
    if (!accessToken || !id) {
      setPlaylist(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchPlaylist = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getPlaylistById(accessToken, id);

        if (!cancelled) {
          setPlaylist(data);
        }
      } catch (err) {
        console.error("Failed to fetch playlist:", err);

        if (!cancelled) {
          setError("Could not load this playlist. Please try again.");
          setPlaylist(null);
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
      <Box sx={{ p: 4, color: "white" }}>
        <Typography>Log in to Spotify to view your playlists.</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#121212",
        }}
      >
        <CircularProgress sx={{ color: "#1ed760" }} />
      </Box>
    );
  }

  if (error || !playlist) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error ?? "Playlist not found."}</Alert>
      </Box>
    );
  }

  const tracks = playlist.items?.items ?? [];
  const coverImage = playlist.images?.[0]?.url;

  return (
    <Box
      sx={{
        minHeight: "100%",
        color: "#fff",
        bgcolor: "#121212",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Playlist header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 2, md: 4 },
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
          background:
            "linear-gradient(180deg, #454545 0%, #282828 65%, #181818 100%)",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            width: { xs: 140, sm: 180, md: 220 },
            height: { xs: 140, sm: 180, md: 220 },
            flexShrink: 0,
            bgcolor: "#282828",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          {coverImage ? (
            <Box
              component="img"
              src={coverImage}
              alt={playlist.name}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#b3b3b3",
              }}
            >
              No image
            </Box>
          )}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, mb: 1, color: "#fff" }}
          >
            Public Playlist
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "2.8rem",
                md: "clamp(2.5rem, 4vw, 5rem)",
              },
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              overflowWrap: "anywhere",
              mb: 2,
            }}
          >
            {playlist.name}
          </Typography>

          {playlist.description && (
            <Typography
              sx={{
                color: "#b3b3b3",
                fontSize: 14,
                mb: 1.5,
              }}
            >
              {playlist.description}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: "#1ed760",
                color: "#000",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              ♪
            </Avatar>

            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              {playlist.owner?.display_name ?? "Spotify user"}
            </Typography>

            <Typography sx={{ color: "#b3b3b3", fontSize: 13 }}>
              · {tracks.length} songs
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Selected track details */}
      {selectedTrack && (
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: 3,
            background: "linear-gradient(180deg, #282828 0%, #181818 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Typography
            sx={{
              color: "#b3b3b3",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.2,
              mb: 2,
            }}
          >
            Selected track
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {selectedTrack.album?.images?.[0]?.url && (
              <Box
                component="img"
                src={selectedTrack.album.images[0].url}
                alt={selectedTrack.name}
                sx={{
                  width: { xs: 120, sm: 160 },
                  height: { xs: 120, sm: 160 },
                  objectFit: "cover",
                  borderRadius: 1,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  flexShrink: 0,
                }}
              />
            )}

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: 24, sm: 36 },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  overflowWrap: "anywhere",
                  mb: 1,
                }}
              >
                {selectedTrack.name}
              </Typography>

              <Typography
                sx={{
                  color: "#fff",
                  fontSize: 14,
                  mb: 0.75,
                }}
              >
                {selectedTrack.artists
                  ?.map((artist: { name: string }) => artist.name)
                  .join(", ") ?? "Unknown artist"}
              </Typography>

              <Typography
                sx={{
                  color: "#b3b3b3",
                  fontSize: 13,
                  mb: 0.75,
                }}
              >
                Album: {selectedTrack.album?.name ?? "Unknown album"}
              </Typography>

              <Typography
                sx={{
                  color: "#b3b3b3",
                  fontSize: 13,
                }}
              >
                Duration: {formatDuration(selectedTrack.duration_ms ?? 0)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Track table */}
      <Box sx={{ px: { xs: 1, md: 3 }, py: 2 }}></Box>

      {/* Track table */}
      <Box sx={{ px: { xs: 1, md: 3 }, py: 2 }}>
        <TableContainer>
          <Table
            sx={{
              minWidth: 650,
              tableLayout: "auto",
              "& th": {
                color: "#b3b3b3",
                fontSize: 12,
                fontWeight: 600,
                borderBottom: "1px solid #404040",
                whiteSpace: "nowrap",
              },
              "& td": {
                color: "#e6e6e6",
                fontSize: 13,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              },
              "& tbody tr:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 48 }}>#</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Album</TableCell>
                <TableCell>Date added</TableCell>
                <TableCell align="right">Duration</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tracks.map((entry, index) => {
                const track = entry.item;

                if (!track) return null;

                return (
                  <TableRow
                    key={`${track.id ?? track.name}-${index}`}
                    sx={{
                      "&:hover .track-title": {
                        color: "#1ed760",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "#b3b3b3 !important" }}>
                      {index + 1}
                    </TableCell>

                    <TableCell sx={{ minWidth: 200 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          py: 0.5,
                        }}
                      >
                        {track.album?.images?.[0]?.url && (
                          <Box
                            component="img"
                            src={track.album.images[0].url}
                            alt=""
                            sx={{
                              width: 42,
                              height: 42,
                              objectFit: "cover",
                              borderRadius: 0.5,
                              flexShrink: 0,
                            }}
                          />
                        )}

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            className="track-title"
                            sx={{
                              color: "#fff",
                              fontSize: 14,
                              fontWeight: 500,
                              transition: "color 0.15s",
                            }}
                          >
                            {track.name}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#b3b3b3",
                              fontSize: 12,
                              mt: 0.3,
                            }}
                          >
                            {track.artists
                              ?.map((artist) => artist.name)
                              .join(", ") ?? "Unknown artist"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ minWidth: 150 }}>
                      {track.album?.name ?? "—"}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatDate(entry.added_at)}
                    </TableCell>

                    <TableCell align="right">
                      {formatDuration(track.duration_ms ?? 0)}
                    </TableCell>
                  </TableRow>
                );
              })}

              {tracks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: "#b3b3b3" }}>
                      This playlist has no tracks.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
