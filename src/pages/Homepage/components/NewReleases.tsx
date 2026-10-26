
import React from "react";
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
  const {
    data: albums,
    isPending,
    isError,
    error,
  } = useGetNewReleases();

  console.log("albums:", albums);
  console.log("isPending:", isPending);
  console.log("isError:", isError);
  console.log("error:", error);
  console.log("Card component:", AlbumCard);
console.log("Card type:", typeof AlbumCard);

  if (isPending) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        width: '100%',
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
            <AlbumCard
              image={album.images?.[0]?.url ?? ""}
              title={album.name}
              subtitle={album.artists
                .map((artist) => artist.name)
                .join(", ")}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NewReleases;
