import { FormEvent, useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  addItemsToPlaylist,
  getPlaylistById,
  searchTracks,
  type PlaylistDetail,
  type SearchTrack,
} from "../../apis/playlistApi";

interface OutletContext {
  accessToken: string | null;
}

function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useOutletContext<OutletContext>();

  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [addingTrackId, setAddingTrackId] = useState<string | null>(null);
  const [addMessage, setAddMessage] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchPlaylist = async () => {
    if (!accessToken || !id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getPlaylistById(accessToken, id);
      setPlaylist(data);
    } catch (err) {
      console.error("Failed to fetch playlist:", err);
      setError(
        err instanceof Error ? err.message : "Could not load this playlist.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadPlaylist = async () => {
      if (!accessToken || !id) {
        setPlaylist(null);
        setIsLoading(false);
        return;
      }

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
          setError(
            err instanceof Error
              ? err.message
              : "Could not load this playlist.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadPlaylist();

    return () => {
      cancelled = true;
    };
  }, [accessToken, id]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setSearchError("Enter a song title or artist name.");
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setAddMessage(null);
    setAddError(null);

    try {
      const results = await searchTracks(query);
      setSearchResults(results);

      if (results.length === 0) {
        setSearchError("No tracks found. Try another search.");
      }
    } catch (err) {
      console.error("Track search failed:", err);
      setSearchError(
        err instanceof Error ? err.message : "Could not search for tracks.",
      );
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddTrack = async (track: SearchTrack) => {
    if (!accessToken || !id) {
      setAddError("Log in to Spotify before adding tracks.");
      return;
    }

    setAddingTrackId(track.id);
    setAddMessage(null);
    setAddError(null);

    try {
      await addItemsToPlaylist(accessToken, id, [track.uri]);

      // Notify the sidebar that this playlist has changed.
      window.dispatchEvent(
        new CustomEvent("spotify-playlist-updated", {
          detail: { playlistId: id },
        }),
      );

      setAddMessage(`Added "${track.name}" to "${playlist?.name}".`);

      // Refresh the main playlist detail page.
      await fetchPlaylist();
    } catch (err) {
      console.error("Failed to add track:", err);
      setAddError(
        err instanceof Error
          ? err.message
          : "Could not add this track to the playlist.",
      );
    } finally {
      setAddingTrackId(null);
    }
  };

  if (!accessToken) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">
          Please log in to Spotify to view and edit your playlists.
        </Alert>
      </Box>
    );
  }

  if (isLoading && !playlist) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !playlist) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => void fetchPlaylist()} sx={{ mt: 2 }}>
          Try again
        </Button>
      </Box>
    );
  }

  if (!playlist) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">Playlist not found.</Alert>
      </Box>
    );
  }

  const tracks = playlist.items?.items ?? [];
  const coverImage = playlist.images?.[0]?.url;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        color: "#fff",
        minHeight: "100%",
        backgroundColor: "#121212",
      }}
    >
      {/* Playlist header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Avatar
          variant="square"
          src={coverImage}
          alt={playlist.name}
          sx={{
            width: 180,
            height: 180,
            bgcolor: "#282828",
            boxShadow: 4,
          }}
        >
          ♪
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline">Playlist</Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              overflowWrap: "anywhere",
              mb: 1,
            }}
          >
            {playlist.name}
          </Typography>

          {playlist.description && (
            <Typography variant="body2" sx={{ color: "#b3b3b3", mb: 1 }}>
              {playlist.description}
            </Typography>
          )}

          <Typography variant="body2" sx={{ color: "#b3b3b3" }}>
            {playlist.owner?.display_name ?? "Spotify user"}
            {" · "}
            {tracks.length} {tracks.length === 1 ? "song" : "songs"}
          </Typography>
        </Box>
      </Box>

      {/* Search and add tracks */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          backgroundColor: "#181818",
          color: "#fff",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Add tracks
        </Typography>

        <Typography variant="body2" sx={{ color: "#b3b3b3", mb: 2 }}>
          Search for a song or artist, then add a track to this playlist.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search songs or artists"
            size="small"
            sx={{
              flex: 1,
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                backgroundColor: "#282828",
                borderRadius: 5,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#535353",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isSearching}
            sx={{
              borderRadius: 5,
              px: 3,
              backgroundColor: "#1ed760",
              color: "#000",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#1fdf64" },
              "&.Mui-disabled": {
                backgroundColor: "#535353",
                color: "#aaa",
              },
            }}
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </Box>

        {isSearching && <CircularProgress size={24} />}

        {searchError && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {searchError}
          </Alert>
        )}

        {addMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {addMessage}
          </Alert>
        )}

        {addError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {addError}
          </Alert>
        )}

        {searchResults.length > 0 && (
          <List disablePadding>
            {searchResults.map((track) => {
              const albumImage = track.album.images?.[0]?.url;
              const isAdding = addingTrackId === track.id;

              return (
                <ListItem
                  key={track.id}
                  divider
                  secondaryAction={
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={addingTrackId !== null}
                      onClick={() => void handleAddTrack(track)}
                      sx={{
                        color: "#fff",
                        borderColor: "#777",
                        borderRadius: 5,
                        "&:hover": {
                          borderColor: "#1ed760",
                          color: "#1ed760",
                        },
                      }}
                    >
                      {isAdding ? "Adding..." : "Add"}
                    </Button>
                  }
                  sx={{
                    pr: 12,
                    borderColor: "#333",
                    "&:hover": { backgroundColor: "#282828" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="square"
                      src={albumImage}
                      alt={track.album.name}
                    >
                      ♪
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={track.name}
                    secondary={`${track.artists
                      .map((artist) => artist.name)
                      .join(", ")} · ${track.album.name}`}
                    slotProps={{
                      primary: {
                        sx: { color: "#fff", fontWeight: 600 },
                      },
                      secondary: {
                        sx: {
                          color: "#b3b3b3",
                          overflowWrap: "anywhere",
                        },
                      },
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Paper>

      {/* Current playlist tracks */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Songs
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          The playlist could not be refreshed: {error}
        </Alert>
      )}

      {isLoading && <CircularProgress size={24} sx={{ mb: 2 }} />}

      {tracks.length === 0 && !isLoading ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            color: "#b3b3b3",
            backgroundColor: "#181818",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
            This playlist is empty
          </Typography>
          <Typography variant="body2">
            Search for a song above and click Add to get started.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            color: "#fff",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#b3b3b3" }}>#</TableCell>
                <TableCell sx={{ color: "#b3b3b3" }}>Title</TableCell>
                <TableCell sx={{ color: "#b3b3b3" }}>Album</TableCell>
                <TableCell sx={{ color: "#b3b3b3" }}>Duration</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tracks.map((entry, index) => {
                const track = entry.item;

                if (!track) return null;

                return (
                  <TableRow
                    key={`${track.id}-${index}`}
                    sx={{
                      "&:hover": { backgroundColor: "#282828" },
                      "& td": {
                        color: "#fff",
                        borderColor: "#333",
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Avatar
                          variant="square"
                          src={track.album.images?.[0]?.url}
                          alt={track.album.name}
                          sx={{ width: 44, height: 44 }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {track.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{ color: "#b3b3b3" }}
                          >
                            {track.artists
                              .map((artist) => artist.name)
                              .join(", ")}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>{track.album.name}</TableCell>

                    <TableCell>{formatDuration(track.duration_ms)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
