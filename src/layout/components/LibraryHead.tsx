import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddIcon from '@mui/icons-material/Add';

const LibraryHead = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <LibraryMusicIcon />
        <Typography variant="h2" fontWeight={700}>
          Your Library
        </Typography>
      </Box>

      <IconButton aria-label="Create playlist">
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default LibraryHead;