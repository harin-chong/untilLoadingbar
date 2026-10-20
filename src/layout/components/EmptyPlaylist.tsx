import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import './EmptyPlaylist.css';

const EmptyPlaylist = () => {
  const handleCreatePlaylist = () => {
    console.log('Create playlist clicked');
  };

  return (
    <Box className="empty-playlist">
      <Typography className="empty-playlist-title">
        Create your first playlist
      </Typography>

      <Typography className="empty-playlist-description">
        It's easy, we'll help you
      </Typography>

      <Button
        className="create-playlist-button"
        variant="contained"
        onClick={handleCreatePlaylist}
      >
        Create playlist
      </Button>
    </Box>
  );
};

export default EmptyPlaylist;