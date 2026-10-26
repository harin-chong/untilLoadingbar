
import { Button } from '@mui/material';
import { getSpotifyAuthUrl } from '../../utils/auth';

const LoginButton = () => {
  const login = async () => {
    try {
      const authUrl = await getSpotifyAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Spotify login failed:', error);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={login}
      sx={{
        bgcolor: '#fff',
        color: '#121212',
        borderRadius: '999px',
        px: 4,
        py: 1.2,
        minWidth: 120,
        fontSize: '1rem',
        fontWeight: 700,
        textTransform: 'none',
        boxShadow: 'none',
        transition: 'transform 0.2s ease',

        '&:hover': {
          bgcolor: '#f0f0f0',
          transform: 'scale(1.04)',
          boxShadow: 'none',
        },
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;