import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import AlbumCard from "../../../common/component/card";
import useGetPopularTracks from "../../../hooks/useGetPopularTracks";

const PopularTracks = () => {
  const navigate = useNavigate();

  const {
    data: tracks,
    isPending,
    isError,
  } = useGetPopularTracks();

  if (isPending) {
    return (
      <Box padding={3} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box padding={3}>
        <Alert severity="error">
          Failed to load popular tracks.
        </Alert>
      </Box>
    );
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <Box padding={3}>
      <Typography variant="h1" marginBottom={3}>
        Popular Tracks
      </Typography>

      <Grid container spacing={3}>
        {tracks?.map((track: any) => (
          <Grid
            key={track.id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <Box
              onClick={() => navigate(`/album/${track.album.id}`)}
              sx={{
                cursor: "pointer",
                height: "100%",
              }}
            >
              <AlbumCard
                image={track.album?.images?.[0]?.url ?? ""}
                title={track.name}
                subtitle={`${track.artists
                  .map((artist: any) => artist.name)
                  .join(", ")} · ${formatDuration(track.duration_ms)}`}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PopularTracks;