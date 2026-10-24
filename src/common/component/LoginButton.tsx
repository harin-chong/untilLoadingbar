
import React from 'react';
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
      color="secondary"
      size="large"
      onClick={login}
    >
      Login
    </Button>
  );
};

export default LoginButton;
