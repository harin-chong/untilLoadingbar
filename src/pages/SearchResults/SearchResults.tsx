
import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { searchAll } from "../../api/api";

import {
  getMyPlaylists,
  addItemsToPlaylist,
} from "../../api/playlistApi";

interface Playlist {
  id: string;
  name: string;
  images?: { url: string }[];
}

interface Track {
  id: string;
  uri: string;
  name: string;
  artists: { id: string; name: string }[];
}

const SearchResults = () => {
  const { keyword } = useParams();

  const { accessToken } = useOutletContext<{
    accessToken: string | null;
  }>();

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [addingPlaylistId, setAddingPlaylistId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  // Search
  useEffect(() => {
    if (!keyword) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setResults(null);

        const data = await searchAll(keyword);

        console.log("SEARCH RESPONSE:", data);

        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword]);

  // Support different response structures
  const tracks: Track[] =
    results?.tracks?.items ??
    results?.items ??
    [];

  const artists =
    results?.artists?.items ??
    [];

  const albums =
    results?.albums?.items ??
    [];

  // Show notification
  const showAlert = (
    text: string,
    severity: "success" | "error"
  ) => {
    setMessage(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Open playlist dialog
  const handleOpenPlaylist = async (track: Track) => {
    if (!accessToken) {
      showAlert("Please log in to Spotify first.", "error");
      return;
    }

    setSelectedTrack(track);
    setDialogOpen(true);
    setPlaylistLoading(true);
    setPlaylists([]);

    try {
      const data = await getMyPlaylists(accessToken, 0, 20);

      console.log("PLAYLIST RESPONSE:", data);

      setPlaylists(data.items);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
      showAlert("Failed to load playlists.", "error");
    } finally {
      setPlaylistLoading(false);
    }
  };

  // Add track to selected playlist
  const handleAddToPlaylist = async (playlist: Playlist) => {
    if (!accessToken || !selectedTrack?.uri) {
      showAlert("Missing access token or track URI.", "error");
      return;
    }

    try {
      setAddingPlaylistId(playlist.id);

      console.log("Adding track:", selectedTrack.uri);
      console.log("Playlist ID:", playlist.id);

      await addItemsToPlaylist(
        accessToken,
        playlist.id,
        [selectedTrack.uri]
      );

      setDialogOpen(false);
      setSelectedTrack(null);

      showAlert(`Added to "${playlist.name}"`, "success");
    } catch (error) {
      console.error("Failed to add track:", error);

      showAlert(
        error instanceof Error
          ? error.message
          : "Failed to add track.",
        "error"
      );
    } finally {
      setAddingPlaylistId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!results) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="white">
          No search results found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, color: "white" }}>

      {/* Tracks */}
      <Typography variant="h5" fontWeight={700} mb={2}>
        Tracks
      </Typography>

      {tracks.length > 0 ? (
        tracks.map((track) => (
          <Box
            key={track.id}
            sx={{
              mb: 1,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <Box>
              <Typography>{track.name}</Typography>

              <Typography color="gray" fontSize={14}>
                {track.artists
                  .map((artist) => artist.name)
                  .join(", ")}
              </Typography>
            </Box>

            <IconButton
              aria-label={`Add ${track.name} to playlist`}
              onClick={() => handleOpenPlaylist(track)}
              sx={{
                color: "white",
                border: "1px solid rgba(255,255,255,0.4)",
                width: 36,
                height: 36,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        ))
      ) : (
        <Typography color="gray">
          No tracks found.
        </Typography>
      )}

      {/* Artists */}
      <Typography variant="h5" fontWeight={700} mb={2} mt={4}>
        Artists
      </Typography>

      {artists.map((artist: any) => (
        <Box key={artist.id} sx={{ mb: 2 }}>
          <Typography>{artist.name}</Typography>
        </Box>
      ))}

      {/* Albums */}
      <Typography variant="h5" fontWeight={700} mb={2} mt={4}>
        Albums
      </Typography>

      {albums.map((album: any) => (
        <Box key={album.id} sx={{ mb: 2 }}>
          <Typography>{album.name}</Typography>

          <Typography color="gray">
            {album.artists
              .map((artist: any) => artist.name)
              .join(", ")}
          </Typography>
        </Box>
      ))}

      {/* Playlist Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          if (!addingPlaylistId) setDialogOpen(false);
        }}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: "#282828",
            color: "white",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle fontWeight={700}>
          Add to Playlist
        </DialogTitle>

        <DialogContent>
          {selectedTrack && (
            <Box sx={{ mb: 2 }}>
              <Typography fontWeight={600}>
                {selectedTrack.name}
              </Typography>

              <Typography color="gray" fontSize={13}>
                {selectedTrack.artists
                  .map((artist) => artist.name)
                  .join(", ")}
              </Typography>
            </Box>
          )}

          {playlistLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <ListItemButton
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist)}
                    disabled={!!addingPlaylistId}
                    sx={{
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    {playlist.images?.[0]?.url && (
                      <Box
                        component="img"
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        sx={{
                          width: 45,
                          height: 45,
                          borderRadius: 1,
                          mr: 2,
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <ListItemText primary={playlist.name} />

                    {addingPlaylistId === playlist.id && (
                      <CircularProgress size={20} />
                    )}
                  </ListItemButton>
                ))
              ) : (
                <Typography color="gray" textAlign="center" p={2}>
                  No playlists found.
                </Typography>
              )}
            </List>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            disabled={!!addingPlaylistId}
            sx={{ color: "white" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={alertSeverity}
          onClose={() => setAlertOpen(false)}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchResults;
