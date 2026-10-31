import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import AlbumCard from "../../../common/component/card";
import useGetRecommendedAlbums from "../../../hooks/useGetRecommendedAlbums";

const RecommendedAlbums = () => {
  const navigate = useNavigate();

  const {
    data: albums,
    isPending,
    isError,
  } = useGetRecommendedAlbums();

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
          Failed to load recommended albums.
        </Alert>
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h1" marginBottom={3}>
        Recommended Albums
      </Typography>

      <Grid container spacing={3}>
        {albums?.map((album: any) => (
          <Grid
            key={album.id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <Box
              onClick={() => navigate(`/album/${album.id}`)}
              sx={{
                cursor: "pointer",
                height: "100%",
              }}
            >
              <AlbumCard
                image={album.images?.[0]?.url ?? ""}
                title={album.name}
                subtitle={album.artists
                  .map((artist: any) => artist.name)
                  .join(", ")}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecommendedAlbums;