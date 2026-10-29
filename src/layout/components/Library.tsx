
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LibraryHead from "./LibraryHead";
import {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  type Playlist,
  type PlaylistDetail,
} from "../../apis/playlistApi";

interface LibraryProps {
  accessToken: string | null;
}

interface PlaylistUpdatedEvent extends CustomEvent<{
  playlistId: string;
}> {}

const Library = ({ accessToken }: LibraryProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPlaylist, setSelectedPlaylist] =
    useState<PlaylistDetail | null>(null);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { ref, inView } = useInView({
    rootMargin: "100px",
  });

  const loadingRef = useRef(false);

  const selectedPlaylistId =
    location.pathname.match(/^\/playlist\/([^/]+)$/)?.[1] ?? null;

  // Reset the list when the access token changes.
  useEffect(() => {
    setPlaylists([]);
    setNextOffset(0);
    setHasMore(true);
    setError(null);
    loadingRef.current = false;
  }, [accessToken]);

  // Load playlists with infinite scrolling.
  useEffect(() => {
    if (!accessToken || !inView || !hasMore || loadingRef.current) {
      return;
    }

    let cancelled = false;

    const fetchPlaylists = async () => {
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const page = await getMyPlaylists(accessToken, nextOffset, 20);

        if (cancelled) return;

        setPlaylists((previous) => {
          const existingIds = new Set(previous.map((item) => item.id));

          return [
            ...previous,
            ...page.items.filter((item) => !existingIds.has(item.id)),
          ];
        });

        setNextOffset(page.nextOffset);
        setHasMore(page.hasMore);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load playlists.",
          );
        }
      } finally {
        if (!cancelled) {
          loadingRef.current = false;
          setIsLoading(false);
        }
      }
    };

    void fetchPlaylists();

    return () => {
      cancelled = true;
      loadingRef.current = false;
    };
  }, [accessToken, inView, hasMore, nextOffset]);

  // Load tracks for the selected playlist.
  useEffect(() => {
    if (!accessToken || !selectedPlaylistId) {
      setSelectedPlaylist(null);
      setIsLoadingTracks(false);
      setTrackError(null);
      return;
    }

    let cancelled = false;

    const fetchTracks = async () => {
      setSelectedPlaylist(null);
      setIsLoadingTracks(true);
      setTrackError(null);

      try {
        const data = await getPlaylistById(accessToken, selectedPlaylistId);

        if (!cancelled) {
          setSelectedPlaylist(data);
        }
      } catch (err) {
        if (!cancelled) {
          setTrackError(
            err instanceof Error ? err.message : "Failed to load tracks.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingTracks(false);
        }
      }
    };

    void fetchTracks();

    return () => {
      cancelled = true;
    };
  }, [accessToken, selectedPlaylistId]);

  // Refresh the sidebar when a track is added.
  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    const handlePlaylistUpdated = (event: Event) => {
      const customEvent = event as PlaylistUpdatedEvent;
      const updatedPlaylistId = customEvent.detail?.playlistId;

      if (!updatedPlaylistId) return;

      const refreshPlaylist = async () => {
        try {
          const data = await getPlaylistById(
            accessToken,
            updatedPlaylistId,
          );

          if (cancelled) return;

          // Update playlist information in the sidebar.
          setPlaylists((previous) =>
            previous.map((item) =>
              item.id === data.id
                ? {
                    ...item,
                    name: data.name,
                    description: data.description,
                    images: data.images ?? [],
                    items: {
                      total: data.items?.total ?? 0,
                    },
                  }
                : item,
            ),
          );

          // Refresh expanded tracks if this playlist is selected.
          if (updatedPlaylistId === selectedPlaylistId) {
            setSelectedPlaylist(data);
            setTrackError(null);
          }
        } catch (err) {
          if (!cancelled) {
            console.error("Failed to refresh sidebar playlist:", err);
          }
        }
      };

      void refreshPlaylist();
    };

    window.addEventListener(
      "spotify-playlist-updated",
      handlePlaylistUpdated,
    );

    return () => {
      cancelled = true;
      window.removeEventListener(
        "spotify-playlist-updated",
        handlePlaylistUpdated,
      );
    };
  }, [accessToken, selectedPlaylistId]);

  // Create a playlist in Spotify.
  const handleCreatePlaylist = async () => {
    const name = newPlaylistName.trim();

    if (!accessToken || !name || isCreating) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const newPlaylist = await createPlaylist(accessToken, {
        name,
        description: newPlaylistDescription.trim(),
        public: false,
      });

      setPlaylists((previous) => [
        newPlaylist,
        ...previous.filter((item) => item.id !== newPlaylist.id),
      ]);

      setCreateDialogOpen(false);
      setNewPlaylistName("");
      setNewPlaylistDescription("");

      navigate(`/playlist/${newPlaylist.id}`);
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create playlist.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  // Login prompt.
  if (!accessToken) {
    return (
      <Box
        sx={{
          p: 2,
          mt: 1,
          borderRadius: 2,
          backgroundColor: "background.default",
        }}
      >
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Create your first playlist
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          It's easy, we'll help you.
        </Typography>

        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Don't have an account?
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sign up for Spotify to create your own playlists and save your
          favourite music.
        </Typography>

        <Box
          component="a"
          href="https://www.spotify.com/signup/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "inline-block",
            px: 2.5,
            py: 1,
            borderRadius: 5,
            backgroundColor: "#fff",
            color: "#000",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 14,
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        >
          Sign up
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      <LibraryHead
        onCreatePlaylist={() => {
          setNewPlaylistName("");
          setNewPlaylistDescription("");
          setCreateError(null);
          setCreateDialogOpen(true);
        }}
      />

      {/* Playlist list */}
      {playlists.map((playlist) => {
        const isSelected = selectedPlaylistId === playlist.id;

        const tracks =
          selectedPlaylist?.id === playlist.id
            ? (selectedPlaylist.items?.items ?? [])
            : [];

        return (
          <Box key={playlist.id}>
            <Box
              component="button"
              type="button"
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              aria-expanded={isSelected}
              aria-current={isSelected ? "page" : undefined}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
                p: 1,
                border: 0,
                borderRadius: 1,
                textAlign: "left",
                font: "inherit",
                color: "text.primary",
                backgroundColor: isSelected ? "action.selected" : "transparent",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Box
                component="img"
                src={playlist.images?.[0]?.url || ""}
                alt=""
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  objectFit: "cover",
                  flexShrink: 0,
                  backgroundColor: "action.hover",
                }}
              />

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography noWrap fontWeight={500}>
                  {playlist.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" noWrap>
                  {playlist.items?.total != null
                    ? `${playlist.items.total} songs`
                    : "Playlist"}
                </Typography>
              </Box>

              <Typography color="text.secondary">
                {isSelected ? "▾" : "›"}
              </Typography>
            </Box>

            {/* Expanded tracks */}
            {isSelected && (
              <Box
                sx={{
                  ml: 2,
                  pl: 1.5,
                  borderLeft: 1,
                  borderColor: "divider",
                  mb: 1,
                }}
              >
                {isLoadingTracks && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      p: 2,
                    }}
                  >
                    <CircularProgress size={20} />
                  </Box>
                )}

                {trackError && (
                  <Typography color="error" variant="body2" sx={{ p: 1 }}>
                    {trackError}
                  </Typography>
                )}

                {!isLoadingTracks &&
                  !trackError &&
                  selectedPlaylist?.id !== playlist.id && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ p: 1 }}
                    >
                      Loading tracks...
                    </Typography>
                  )}

                {tracks.map((entry, index) => {
                  const track = entry.item;

                  if (!track) return null;

                  return (
                    <Box
                      key={`${track.id}-${index}`}
                      component="button"
                      type="button"
                      onClick={() => {
                        navigate(`/playlist/${playlist.id}`, {
                          state: { track },
                        });
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        width: "100%",
                        p: 1,
                        border: 0,
                        borderRadius: 1,
                        textAlign: "left",
                        font: "inherit",
                        color: "text.primary",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={track.album.images?.[0]?.url || ""}
                        alt=""
                        sx={{
                          width: 36,
                          height: 36,
                          objectFit: "cover",
                          borderRadius: 0.5,
                          flexShrink: 0,
                        }}
                      />

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" noWrap fontWeight={500}>
                          {track.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                          display="block"
                        >
                          {track.artists
                            .map((artist) => artist.name)
                            .join(", ")}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}

                {!isLoadingTracks &&
                  !trackError &&
                  selectedPlaylist?.id === playlist.id &&
                  tracks.length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ p: 1 }}
                    >
                      No tracks found.
                    </Typography>
                  )}
              </Box>
            )}
          </Box>
        );
      })}

      {/* Loading and errors */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 2,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mx: 1, my: 1 }}>
          {error}
        </Alert>
      )}

      {!isLoading && !error && playlists.length === 0 && !hasMore && (
        <Typography sx={{ p: 2 }} color="text.secondary">
          No playlists found.
        </Typography>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && (
        <Box
          ref={ref}
          sx={{
            minHeight: 24,
            display: "flex",
            justifyContent: "center",
            p: 1,
          }}
        />
      )}

      {/* Create playlist dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => {
          if (!isCreating) {
            setCreateDialogOpen(false);
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Create a playlist</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            required
            fullWidth
            margin="normal"
            label="Playlist name"
            placeholder="My playlist"
            value={newPlaylistName}
            onChange={(event) => setNewPlaylistName(event.target.value)}
            slotProps={{
              htmlInput: { maxLength: 100 },
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                newPlaylistName.trim() &&
                !isCreating
              ) {
                event.preventDefault();
                void handleCreatePlaylist();
              }
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description (optional)"
            placeholder="Add a description"
            value={newPlaylistDescription}
            onChange={(event) => setNewPlaylistDescription(event.target.value)}
            multiline
            minRows={2}
            slotProps={{
              htmlInput: { maxLength: 300 },
            }}
          />

          {createError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {createError}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setCreateDialogOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => void handleCreatePlaylist()}
            disabled={!newPlaylistName.trim() || isCreating}
          >
            {isCreating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Library;
