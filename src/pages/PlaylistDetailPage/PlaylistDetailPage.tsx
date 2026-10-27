
import { Box, Typography, IconButton, Chip } from "@mui/material";
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

const PlaylistPage = () => {
  const location = useLocation();
  const track = location.state?.track as Track | undefined;

  if (!track) {
    return (
      
      <Box sx={{ p: 4 }}>
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

  return (

    
    <Box
      sx={{
        minHeight: "100%",
        mx: -1,
        mt: -1,
        overflow: "hidden",
        borderRadius: 2,
        background: image
          ? `linear-gradient(180deg, rgba(90,75,100,0.65) 0%, rgba(30,30,35,0.92) 340px, #121212 600px)`
          : "#121212",
      }}
    >
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Chip
          label="SONG DETAILS"
          size="small"
          sx={{
            mb: 3,
            color: "white",
            bgcolor: "rgba(255,255,255,0.12)",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        />

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
                width: { xs: 200, sm: 240, md: 260 },
                aspectRatio: "1 / 1",
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: "0 12px 36px rgba(0,0,0,0.35)",
              }}
            />
          )}

          <Box sx={{ minWidth: 0, pb: { md: 1 } }}>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}
            >
              Song
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "2.2rem", sm: "3rem", md: "3.6rem" },
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                overflowWrap: "anywhere",
                mb: 2,
              }}
            >
              {track.name}
            </Typography>

            <Typography
              sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}
            >
              {track.artists.map((artist) => artist.name).join(", ")}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.65)", mt: 1 }}
            >
              {track.album.name} · {duration}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
          <IconButton
            aria-label="Play song"
            sx={{
              width: 58,
              height: 58,
              bgcolor: "#1ed760",
              color: "#000",
              "&:hover": { bgcolor: "#3be477", transform: "scale(1.04)" },
            }}
          >
            <PlayArrowRoundedIcon sx={{ fontSize: 36 }} />
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
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            <MoreHorizRoundedIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Track information
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, minmax(0, 1fr))",
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
              value={track.artists.map((artist) => artist.name).join(", ")}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

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
      bgcolor: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.06)",
      minWidth: 0,
    }}
  >
    <Box sx={{ color: "#1ed760", mt: 0.2 }}>{icon}</Box>
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

export default PlaylistPage;
