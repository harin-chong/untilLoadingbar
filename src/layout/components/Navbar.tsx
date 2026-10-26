
import { Box } from '@mui/material';
import LoginButton from '../../common/component/LoginButton';

interface NavbarProps {
  accessToken: string | null;
}

const Navbar = ({ accessToken }: NavbarProps) => {
  return (
    <Box
  component="header"
  sx={{
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  minHeight: 32,
  px: { xs: 1, md: 2 },
  mb: 0,
  flexShrink: 0,
}}
>
  {!accessToken && <LoginButton />}
</Box>
  );
};

export default Navbar;
