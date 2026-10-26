import React, { useEffect, useRef, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Box, Typography, styled } from "@mui/material";
import Library from "./layout/components/Library";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import Profile from "./common/component/Profile";
import LibraryHead from "./layout/components/LibraryHead";
import EmptyPlaylist from "./layout/components/EmptyPlaylist";
import Navbar from "./layout/components/Navbar";
import { useExchangeToken } from "./hooks/useExchangeToken";

const Layout = styled("div")({
  display: "flex",
  height: "100vh",
  padding: "8px",
  boxSizing: "border-box",
});

const Sidebar = styled("div")(({ theme }) => ({
  width: "331px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  borderRadius: "8px",
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  flex: "1 1 0",
  minWidth: 0,
  minHeight: 0,
  padding: "8px",
  marginBottom: "8px",
  marginRight: "8px",
  boxSizing: "border-box",
  overflowY: "auto",
}));
const NavList = styled("ul")({
  listStyle: "none",
  padding: 0,
  margin: 0,
});

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  padding: "8px",
  color: theme.palette.text.secondary,

  "&:hover": {
    color: theme.palette.text.primary,
  },

  "&.active": {
    color: theme.palette.text.primary,
  },
}));

const AppLayout = () => {
  console.log("AppLayout rendered");

  const { mutateAsync } = useExchangeToken();
  const exchangeStarted = useRef(false);

  const [accessToken, setAccessToken] = useState<string | null>(() =>
    sessionStorage.getItem("access_token"),
  );

  console.log("Token exists:", Boolean(accessToken));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const authError = params.get("error");

    if (authError) {
      console.error("Spotify authorization failed:", authError);
      return;
    }

    if (!code || exchangeStarted.current) {
      return;
    }

    exchangeStarted.current = true;

    const exchange = async () => {
      try {
        const tokenData = await mutateAsync(code);
        setAccessToken(tokenData.access_token);

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );

        console.log("Spotify login successful!");
      } catch (error) {
        console.error("Spotify token exchange failed:", error);
        exchangeStarted.current = false;
      }
    };

    void exchange();
  }, [mutateAsync]);

  console.log("AppLayout rendered");
  console.log("Current accessToken:", accessToken);

  return (
    <Layout>
      <Sidebar>
        <ContentBox>
          <NavList>
            <li>
              <StyledNavLink to="/">
                <HomeIcon />
                <Typography variant="h2" fontWeight={700}>
                  Home
                </Typography>
              </StyledNavLink>
              <StyledNavLink to="/search">
                <SearchIcon />
                <Typography variant="h2" fontWeight={700}>
                  Search
                </Typography>
              </StyledNavLink>
              <StyledNavLink to="/playlist">
                <LibraryHead />
              </StyledNavLink>
              <Library accessToken={accessToken} />
            </li>
          </NavList>
        </ContentBox>
      </Sidebar>

      <ContentBox sx={{ pt: 0 }}>
        <Navbar accessToken={accessToken} />

        <Profile accessToken={accessToken} />

        <Outlet context={{ accessToken }} />
      </ContentBox>
    </Layout>
  );
};

export default AppLayout;
