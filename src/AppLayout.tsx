
import { useEffect, useRef, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Box, Typography, styled } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";

import Library from "./layout/components/Library";
import Profile from "./common/component/Profile";
import LibraryHead from "./layout/components/LibraryHead";
import Navbar from "./layout/components/Navbar";
import { useExchangeToken } from "./hooks/useExchangeToken";

const Layout = styled("div")({
  display: "flex",
  gap: 8,
  height: "100vh",
  padding: 8,
  boxSizing: "border-box",
  overflow: "hidden",
  backgroundColor: "#000",
});

const Sidebar = styled("aside")(({ theme }) => ({
  width: 331,
  minWidth: 240,
  height: "100%",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const SidePanel = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: 8,
  boxSizing: "border-box",
}));

const NavigationPanel = styled(SidePanel)({
  flexShrink: 0,
});

const LibraryPanel = styled(SidePanel)({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
});

const MainPanel = styled(Box)(({ theme }) => ({
  flex: "1 1 0",
  minWidth: 0,
  minHeight: 0,
  height: "100%",
  overflowY: "auto",
  position: "relative",
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxSizing: "border-box",
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
  gap: 16,
  padding: "10px 8px",
  borderRadius: 6,
  color: theme.palette.text.secondary,

  "&:hover": {
    color: theme.palette.text.primary,
  },

  "&.active": {
    color: theme.palette.text.primary,
  },

  "& .MuiTypography-root": {
    fontSize: 14,
  },
}));

const AppLayout = () => {
  const { mutateAsync } = useExchangeToken();
  const exchangeStarted = useRef(false);

  const [accessToken, setAccessToken] = useState<string | null>(() =>
    sessionStorage.getItem("access_token"),
  );

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

        sessionStorage.setItem("access_token", tokenData.access_token);
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

  return (
    <Layout>
      {/* Left sidebar */}
      <Sidebar>
        {/* Home and Search panel */}
        <NavigationPanel>
          <NavList>
            <li>
              <StyledNavLink to="/" end>
                <HomeIcon />
                <Typography fontWeight={700}>Home</Typography>
              </StyledNavLink>
            </li>

            <li>
              <StyledNavLink to="/search">
                <SearchIcon />
                <Typography fontWeight={700}>Search</Typography>
              </StyledNavLink>
            </li>
          </NavList>
        </NavigationPanel>

        {/* Library panel */}
        <LibraryPanel>
          <NavList>
            <li>
              <StyledNavLink to="/playlist">
                <LibraryHead />
              </StyledNavLink>
            </li>
          </NavList>

          <Library accessToken={accessToken} />
        </LibraryPanel>
      </Sidebar>

      {/* Main content: remains mounted while nested routes change */}
      <MainPanel>
        <Box
          sx={{
            position: "relative",
            minHeight: "100%",
          }}
        >
          <Navbar accessToken={accessToken} />
          <Profile accessToken={accessToken} />

          <Box sx={{ px: { xs: 1, md: 2 }, pb: 2 }}>
            <Outlet context={{ accessToken }} />
          </Box>
        </Box>
      </MainPanel>
    </Layout>
  );
};

export default AppLayout;
