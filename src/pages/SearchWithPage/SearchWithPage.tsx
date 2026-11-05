
import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { searchAll } from "../../apis/albumApi";
import {
  getMyPlaylists,
  addItemsToPlaylist,
} from "../../apis/playlistApi";

interface Playlist {
  id: string;
  name: string;
  images?: { url: string }[];
}

interface OutletContext {
  accessToken: string | null;
}

const SearchWithPage = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();

  const { accessToken } = useOutletContext<OutletContext>();

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Playlist dialog states
  const [openPlaylistDialog, setOpenPlaylistDialog] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [addingTrack, setAddingTrack] = useState(false);
  const [message, setMessage] = useState("");

  // Search
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

  // Open playlist dialog
  const handleOpenPlaylistDialog = async (track: any) => {
    // Check login status
    if (!accessToken) {
      alert("Please log in first.");
      return;
    }

    setSelectedTrack(track);
    setOpenPlaylistDialog(true);
    setLoadingPlaylists(true);
    setMessage("");

    try {
      const data = await getMyPlaylists(accessToken);
      setPlaylists(data.items);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
      setMessage("Failed to load playlists.");
    } finally {
      setLoadingPlaylists(false);
    }
  };

  // Add track to selected playlist
  const handleAddTrack = async (playlistId: string) => {
    if (!accessToken || !selectedTrack) return;

    try {
      setAddingTrack(true);

      await addItemsToPlaylist(
        accessToken,
        playlistId,
        [selectedTrack.uri]
      );

      setMessage("Track added successfully!");

      setTimeout(() => {
        setOpenPlaylistDialog(false);
        setSelectedTrack(null);
        setMessage("");
      }, 1000);
    } catch (error) {
      console.error("Failed to add track:", error);
      setMessage("Failed to add track. Please try again.");
    } finally {
      setAddingTrack(false);
    }
  };

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

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontWeight={600} noWrap>
                    {track.name}
                  </Typography>

                  <Typography variant="body2" color="gray" noWrap>
                    {track.artists
                      .map((artist: any) => artist.name)
                      .join(", ")}
                  </Typography>
                </Box>

                {/* Add to playlist button */}
                <IconButton
                  onClick={() => handleOpenPlaylistDialog(track)}
                  sx={{
                    color: "white",
                    "&:hover": {
                      color: "#1DB954",
                      backgroundColor: "#333",
                    },
                  }}
                  aria-label={`Add ${track.name} to playlist`}
                >
                  <AddIcon />
                </IconButton>
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
                  window.open(artist.external_urls.spotify, "_blank")
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

      {/* Playlist selection dialog */}
      <Dialog
        open={openPlaylistDialog}
        onClose={() => {
          if (!addingTrack) {
            setOpenPlaylistDialog(false);
            setMessage("");
          }
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#282828",
            color: "white",
            width: "100%",
            maxWidth: 400,
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle fontWeight={700}>
          Add to playlist
        </DialogTitle>

        <DialogContent>
          {selectedTrack && (
            <Typography color="gray" variant="body2" mb={2}>
              {selectedTrack.name}
            </Typography>
          )}

          {loadingPlaylists ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {playlists.map((playlist) => (
                <ListItemButton
                  key={playlist.id}
                  onClick={() => handleAddTrack(playlist.id)}
                  disabled={addingTrack}
                  sx={{
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "#3e3e3e",
                    },
                  }}
                >
                  {playlist.images?.[0]?.url && (
                    <Box
                      component="img"
                      src={playlist.images[0].url}
                      sx={{
                        width: 45,
                        height: 45,
                        objectFit: "cover",
                        mr: 2,
                        borderRadius: 1,
                      }}
                    />
                  )}

                  <ListItemText primary={playlist.name} />
                </ListItemButton>
              ))}

              {playlists.length === 0 && (
                <Typography color="gray" p={2}>
                  No playlists found.
                </Typography>
              )}
            </List>
          )}

          {message && (
            <Typography
              variant="body2"
              sx={{
                color: message.includes("successfully")
                  ? "#1DB954"
                  : "#ff7777",
                mt: 2,
              }}
            >
              {message}
            </Typography>
          )}

          <Button
            onClick={() => setOpenPlaylistDialog(false)}
            disabled={addingTrack}
            sx={{ color: "white", mt: 1 }}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SearchWithPage;
