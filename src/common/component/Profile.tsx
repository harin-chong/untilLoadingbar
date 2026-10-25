
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LogoutIcon from '@mui/icons-material/Logout';

import useGetCurrentUserProfile from '../../hooks/useGetCurrentUserProfile';

interface ProfileProps {
  accessToken: string | null;
}

const Profile = ({ accessToken }: ProfileProps) => {
  const {
    data: user,
    isPending,
    isError,
  } = useGetCurrentUserProfile(accessToken);

  // 1. 로그아웃 함수는 return보다 위에 선언
  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('expires_at');
    sessionStorage.removeItem('code_verifier');

    window.location.reload();
  };

  if (!accessToken) {
    return null;
  }

  if (isPending) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
        }}
      >
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError || !user) {
    return (
      <Box sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
        <Typography variant="body2">
          Could not load your Spotify profile.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        p: { xs: 2, sm: 3 },
        my: 2,
        borderRadius: 3,
        background:
          'linear-gradient(135deg, #252525 0%, #171717 60%, #123b2b 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        color: '#fff',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 180,
          height: 180,
          right: -60,
          top: -100,
          borderRadius: '50%',
          background: 'rgba(29,185,84,0.12)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        },
      }}
    >
      <Avatar
        src={user.images?.[0]?.url}
        alt={user.display_name ?? 'Spotify user'}
        sx={{
          width: { xs: 68, sm: 88 },
          height: { xs: 68, sm: 88 },
          flexShrink: 0,
          bgcolor: '#1DB954',
          color: '#111',
          fontSize: 32,
          fontWeight: 700,
          border: '3px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        {!user.images?.[0]?.url &&
          (user.display_name?.charAt(0)?.toUpperCase() || (
            <MusicNoteIcon fontSize="large" />
          ))}
      </Avatar>

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: '#1DB954',
            fontWeight: 700,
            letterSpacing: 1.5,
            lineHeight: 1.8,
          }}
        >
          SPOTIFY ACCOUNT
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: -0.5,
            overflowWrap: 'anywhere',
            lineHeight: 1.3,
            mb: 1.5,
          }}
        >
          {user.display_name || user.id}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            component="a"
            href={user.external_urls.spotify}
            target="_blank"
            rel="noreferrer"
            variant="contained"
            endIcon={<OpenInNewIcon />}
            sx={{
              bgcolor: '#1DB954',
              color: '#111',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 20,
              px: 2.2,
              py: 0.8,
              '&:hover': {
                bgcolor: '#1ed760',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            View profile
          </Button>

          <Button
            onClick={handleLogout}
            variant="outlined"
            startIcon={<LogoutIcon />}
            sx={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.25)',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 20,
              px: 2,
              py: 0.8,
              '&:hover': {
                borderColor: '#fff',
                bgcolor: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            Log out
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
