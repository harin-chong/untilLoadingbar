
import {
  Box,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { useLocation } from "react-router-dom";

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  artists: {
    id: string;
    name: string;
  }[];
  album: {
    name: string;
    images: {
      url: string;
      height: number | null;
      width: number | null;
    }[];
  };
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 1.5,
      p: 2,
      borderRadius: 2,
      bgcolor: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.08)",
      minWidth: 0,
      transition: "background-color 0.2s ease",
      "&:hover": {
        bgcolor: "rgba(255,255,255,0.1)",
      },
    }}
  >
    <Box sx={{ color: "#1ed760", mt: 0.2, display: "flex" }}>
      {icon}
    </Box>

    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography
        fontWeight={600}
        sx={{ mt: 0.5, overflowWrap: "anywhere" }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

const PlaylistPage = () => {
  const location = useLocation();
  const track = location.state?.track as Track | undefined;

  if (!track) {
    return (
      <Box sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h5" fontWeight={700}>
          Select a song
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Choose a song from your library to see its details.
        </Typography>
      </Box>
    );
  }

  const duration = `${Math.floor(track.duration_ms / 60000)}:${String(
    Math.floor((track.duration_ms % 60000) / 1000)
  ).padStart(2, "0")}`;

  const image = track.album.images[0]?.url;
  const artists = track.artists.map((artist) => artist.name).join(", ");

  return (
    <Box
      sx={{
        minHeight: "100%",
        mx: -1,
        mt: -1,
        overflow: "hidden",
        borderRadius: 2,
        background:
          "linear-gradient(180deg, #594765 0%, #302934 300px, #181818 540px, #121212 760px)",
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Chip
          label="SONG DETAILS"
          size="small"
          sx={{
            mb: 3,
            color: "#fff",
            bgcolor: "rgba(255,255,255,0.12)",
            fontWeight: 700,
            letterSpacing: 1,
            borderRadius: 1,
          }}
        />

        {/* Song header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "flex-end" },
            gap: { xs: 3, md: 4 },
          }}
        >
          {image && (
            <Box
              component="img"
              src={image}
              alt={track.album.name}
              sx={{
                width: { xs: 200, sm: 240, md: 280 },
                height: { xs: 200, sm: 240, md: 280 },
                flexShrink: 0,
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
              }}
            />
          )}

          <Box sx={{ minWidth: 0, pb: { md: 1 } }}>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.85)", mb: 1 }}
            >
              Song
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "2.2rem",
                  sm: "3rem",
                  md: "clamp(2.5rem, 4vw, 4.5rem)",
                },
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                overflowWrap: "anywhere",
                mb: 2,
              }}
            >
              {track.name}
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.9)",
                fontWeight: 600,
                overflowWrap: "anywhere",
              }}
            >
              {artists}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.7)", mt: 1 }}
            >
              {track.album.name} · {duration}
            </Typography>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
          <IconButton
            aria-label="Play song"
            sx={{
              width: 60,
              height: 60,
              bgcolor: "#1ed760",
              color: "#000",
              transition: "transform 0.2s, background-color 0.2s",
              "&:hover": {
                bgcolor: "#3be477",
                transform: "scale(1.06)",
              },
            }}
          >
            <PlayArrowRoundedIcon sx={{ fontSize: 38 }} />
          </IconButton>

          <IconButton
            aria-label="Add to favourites"
            sx={{
              color: "rgba(255,255,255,0.7)",
              "&:hover": { color: "#1ed760" },
            }}
          >
            <FavoriteBorderRoundedIcon sx={{ fontSize: 30 }} />
          </IconButton>

          <IconButton
            aria-label="More options"
            sx={{
              color: "rgba(255,255,255,0.7)",
              "&:hover": { color: "#fff" },
            }}
          >
            <MoreHorizRoundedIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </Box>

        {/* Track information */}
        <Box sx={{ mt: 5 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2, letterSpacing: "-0.02em" }}
          >
            Track information
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <InfoItem
              icon={<AlbumRoundedIcon />}
              label="Album"
              value={track.album.name}
            />

            <InfoItem
              icon={<AccessTimeRoundedIcon />}
              label="Duration"
              value={duration}
            />

            <InfoItem
              icon={<PersonOutlineRoundedIcon />}
              label="Artist"
              value={artists}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PlaylistPage;
