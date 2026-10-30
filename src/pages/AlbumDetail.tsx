
import { useParams } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import useGetAlbumById from "../hooks/useGetAlbumById";

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const AlbumDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: album,
    isPending,
    isError,
  } = useGetAlbumById(id ?? "");

  if (isPending) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#1DB954" }} />
      </Box>
    );
  }

  if (isError || !album) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Failed to load album details.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
      }}
    >
      {/* Album Header */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          px: { xs: 3, md: 5 },
          pt: { xs: 5, md: 7 },
          pb: 5,
          background: `linear-gradient(
            180deg,
            rgba(90, 90, 90, 0.85) 0%,
            rgba(35, 35, 35, 0.95) 65%,
            #121212 100%
          )`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 3, sm: 4 }}
          alignItems={{ xs: "center", sm: "flex-end" }}
        >
          {/* Album Cover */}
          <Avatar
            src={album.images?.[0]?.url}
            variant="square"
            alt={album.name}
            sx={{
              width: { xs: 220, sm: 250, md: 280 },
              height: { xs: 220, sm: 250, md: 280 },
              borderRadius: 2,
              boxShadow: "0 12px 35px rgba(0,0,0,0.5)",
              flexShrink: 0,
            }}
          />

          {/* Album Information */}
          <Box
            sx={{
              minWidth: 0,
              textAlign: { xs: "center", sm: "left" },
              pb: 1,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                letterSpacing: 2,
                color: "#ddd",
              }}
            >
              {album.album_type}
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.8rem",
                  md: "3.5rem",
                },
                fontWeight: 800,
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                mt: 1,
                mb: 2,
                overflowWrap: "anywhere",
              }}
            >
              {album.name}
            </Typography>

            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#fff",
                mb: 1,
              }}
            >
              {album.artists
                .map((artist: any) => artist.name)
                .join(", ")}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {album.release_date}
              {" · "}
              {album.total_tracks} songs
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Track Section */}
      <Box
        sx={{
          px: { xs: 2, md: 5 },
          pb: 6,
          pt: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 3,
            letterSpacing: "-0.5px",
          }}
        >
          Tracks
        </Typography>

        <List disablePadding>
          {album.tracks.items.map(
            (track: any, index: number) => (
              <Box key={track.id}>
                <ListItem
                  disableGutters
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  {/* Track Number */}
                  <Typography
                    sx={{
                      width: 35,
                      flexShrink: 0,
                      color: "#999",
                      fontSize: "0.9rem",
                    }}
                  >
                    {index + 1}
                  </Typography>

                  {/* Track Information */}
                  <ListItemText
                    primary={track.name}
                    secondary={track.artists
                      .map((artist: any) => artist.name)
                      .join(", ")}
                    slotProps={{
                      primary: {
                        sx: {
                          color: "#fff",
                          fontWeight: 500,
                          fontSize: "0.95rem",
                          mb: 0.5,
                        },
                      },
                      secondary: {
                        sx: {
                          color: "#999",
                          fontSize: "0.8rem",
                        },
                      },
                    }}
                    sx={{ minWidth: 0, mr: 2 }}
                  />

                  {/* Duration */}
                  <Typography
                    sx={{
                      color: "#999",
                      fontSize: "0.85rem",
                      flexShrink: 0,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatDuration(track.duration_ms)}
                  </Typography>
                </ListItem>

                <Divider
                  sx={{
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                />
              </Box>
            )
          )}
        </List>
      </Box>
    </Box>
  );
};

export default AlbumDetail;
