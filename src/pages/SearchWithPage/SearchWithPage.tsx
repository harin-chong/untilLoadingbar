import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

import { searchAll } from "../../apis/albumApi";

const SearchWithPage = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setResults(null);

        const data = await searchAll(keyword);
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!results) return null;

  const tracks = results.tracks?.items || [];
  const artists = results.artists?.items || [];
  const albums = results.albums?.items || [];

  const hasResults =
    tracks.length > 0 ||
    artists.length > 0 ||
    albums.length > 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, color: "white" }}>

      <Typography variant="h4" fontWeight={700} mb={4}>
        Search results
      </Typography>

      {!hasResults && (
        <Typography color="gray">
          No results found for "{keyword}"
        </Typography>
      )}

      {/* Tracks */}
      {tracks.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Tracks
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {tracks.map((track: any) => (
              <Box
                key={track.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#282828",
                  },
                }}
              >
                <Box
                  component="img"
                  src={track.album.images?.[0]?.url}
                  alt={track.name}
                  sx={{
                    width: 55,
                    height: 55,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />

                <Box>
                  <Typography fontWeight={600}>
                    {track.name}
                  </Typography>

                  <Typography variant="body2" color="gray">
                    {track.artists
                      .map((artist: any) => artist.name)
                      .join(", ")}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Artists */}
      {artists.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Artists
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(5, 1fr)",
              },
              gap: 2,
            }}
          >
            {artists.map((artist: any) => (
              <Box
                key={artist.id}
                onClick={() =>
                  window.open(
                    artist.external_urls.spotify,
                    "_blank"
                  )
                }
                sx={{
                  p: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#282828",
                  },
                }}
              >
                <Box
                  component="img"
                  src={artist.images?.[0]?.url}
                  alt={artist.name}
                  sx={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    borderRadius: "50%",
                    mb: 1,
                  }}
                />

                <Typography fontWeight={600}>
                  {artist.name}
                </Typography>

                <Typography variant="body2" color="gray">
                  Artist
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Albums */}
      {albums.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Albums
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(5, 1fr)",
              },
              gap: 2,
            }}
          >
            {albums.map((album: any) => (
              <Box
                key={album.id}
                onClick={() => navigate(`/album/${album.id}`)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#282828",
                  },
                }}
              >
                <Box
                  component="img"
                  src={album.images?.[0]?.url}
                  alt={album.name}
                  sx={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    borderRadius: 1,
                    mb: 1,
                  }}
                />

                <Typography fontWeight={600}>
                  {album.name}
                </Typography>

                <Typography variant="body2" color="gray">
                  {album.artists
                    .map((artist: any) => artist.name)
                    .join(", ")}
                </Typography>

                <Typography variant="body2" color="gray">
                  {album.release_date?.slice(0, 4)} · Album
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default SearchWithPage;