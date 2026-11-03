import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { searchAll } from "../../api/api";

const SearchResults = () => {
  const { keyword } = useParams();

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;

    const fetchResults = async () => {
      try {
        setLoading(true);

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
    return <Typography>Loading...</Typography>;
  }

  if (!results) return null;

  return (
    <Box sx={{ p: 3, color: "white" }}>

      {/* Tracks */}
      <Typography variant="h5" fontWeight={700} mb={2}>
        Tracks
      </Typography>

      {results.tracks?.items?.map((track: any) => (
        <Box key={track.id} sx={{ mb: 2 }}>
          <Typography>{track.name}</Typography>
          <Typography color="gray">
            {track.artists.map((artist: any) => artist.name).join(", ")}
          </Typography>
        </Box>
      ))}

      {/* Artists */}
      <Typography variant="h5" fontWeight={700} mb={2} mt={4}>
        Artists
      </Typography>

      {results.artists?.items?.map((artist: any) => (
        <Box key={artist.id} sx={{ mb: 2 }}>
          <Typography>{artist.name}</Typography>
        </Box>
      ))}

      {/* Albums */}
      <Typography variant="h5" fontWeight={700} mb={2} mt={4}>
        Albums
      </Typography>

      {results.albums?.items?.map((album: any) => (
        <Box key={album.id} sx={{ mb: 2 }}>
          <Typography>{album.name}</Typography>
          <Typography color="gray">
            {album.artists.map((artist: any) => artist.name).join(", ")}
          </Typography>
        </Box>
      ))}

    </Box>
  );
};

export default SearchResults;