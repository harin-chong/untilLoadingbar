
import { Box, Typography, IconButton } from '@mui/material';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddIcon from '@mui/icons-material/Add';

interface LibraryHeadProps {
  onCreatePlaylist: () => void;
}

const LibraryHead = ({ onCreatePlaylist }: LibraryHeadProps) => {
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

      <IconButton
        aria-label="Create playlist"
        onClick={onCreatePlaylist}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default LibraryHead;
