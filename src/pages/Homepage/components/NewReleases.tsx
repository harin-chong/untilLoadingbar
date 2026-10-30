
import React from "react";
import { useNavigate } from "react-router-dom";
import AlbumCard from "../../../common/component/card";

import {
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

import useGetNewReleases from "../../../hooks/useGetNewReleases";

const NewReleases = () => {
  const navigate = useNavigate();

  const {
    data: albums,
    isPending,
    isError,
  } = useGetNewReleases();

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        Failed to load new releases.
      </Alert>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h1" marginBottom={3}>
        New Releases
      </Typography>

      <Grid container spacing={3}>
        {albums?.map((album) => (
          <Grid
            key={album.id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <Box
              onClick={() => navigate(`/album/${album.id}`)}
              sx={{
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <AlbumCard
                image={album.images?.[0]?.url ?? ""}
                title={album.name}
                subtitle={album.artists
                  .map((artist) => artist.name)
                  .join(", ")}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NewReleases;
