import React from 'react'
import { Outlet, NavLink } from 'react-router-dom';
import {
Box,
Typography,
styled,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search'
import LibraryHead from './layout/components/LibraryHead';
import EmptyPlaylist from './layout/components/EmptyPlaylist';
import Navbar from './layout/components/Navbar';

const Layout = styled('div')({
    display: 'flex',
    height: '100vh',
    padding: '8px',
    boxSizing: 'border-box',
});

const Sidebar = styled("div") (({theme}) => ({
    width: "331px",
    height: "100%",
    display: "flex",
    flexDirection:"column",
    [theme.breakpoints.down("sm")]: {
        display: "none",
    }
}));

const ContentBox = styled(Box)(({ theme }) => ({
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    width: '100%',
    padding: '8px',
    marginBottom: '8px',
    marginRight: '8px',
    boxSizing: 'border-box',
}));    

const NavList = styled("ul")({
    listStyle: "none",
    padding: 0,
    margin: 0,
})

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '8px',
    color: theme.palette.text.secondary,

    '&:hover': {
        color: theme.palette.text.primary,
    },

    '&.active': {
        color: theme.palette.text.primary,
    },

}));

const AppLayout = () => {
  return (
    <Layout>
        <Sidebar>
            <ContentBox>
                <NavList>
                    <li>
                        <StyledNavLink to="/">
                          <HomeIcon/>
                          <Typography variant="h2" fontWeight={700}>Home</Typography>
                        </StyledNavLink>
                        <StyledNavLink to="/search">
                          <SearchIcon/>
                          <Typography variant="h2" fontWeight={700}>Search</Typography>
                        </StyledNavLink>
                        <StyledNavLink to="playlist">
                          <LibraryHead />
                        </StyledNavLink>
                        <StyledNavLink to="playlist">
                          <EmptyPlaylist />
                        </StyledNavLink>
                    </li>
                </NavList>
            </ContentBox>
        </Sidebar>

        <ContentBox>
            <Navbar/>
            <Outlet/>
        </ContentBox>
    </Layout>
  )
}

export default AppLayout
