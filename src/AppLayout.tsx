
import { useEffect, useRef, useState } from "react";
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Box,
  Typography,
  styled,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Drawer,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

import Library from "./layout/components/Library";
import Profile from "./common/component/Profile";
import Navbar from "./layout/components/Navbar";
import { useExchangeToken } from "./hooks/useExchangeToken";

// ==========================================
// Layout
// ==========================================

const Layout = styled("div")({
  display: "flex",
  gap: 8,
  height: "100dvh",
  padding: 8,
  boxSizing: "border-box",
  overflow: "hidden",
  backgroundColor: "#000",

  "@media (max-width: 768px)": {
    padding: 0,
    gap: 0,
  },
});

// ==========================================
// Desktop Sidebar
// ==========================================

const Sidebar = styled("aside")({
  width: 331,
  minWidth: 240,
  height: "100%",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  gap: 8,

  "@media (max-width: 768px)": {
    display: "none",
  },
});

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

// ==========================================
// Main Content
// ==========================================

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

  "@media (max-width: 768px)": {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
}));

// ==========================================
// Desktop Navigation
// ==========================================

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

// ==========================================
// Mobile Navigation
// ==========================================

const MobileNavigation = styled(Paper)({
  display: "none",

  "@media (max-width: 768px)": {
    display: "block",
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 1200,
    borderRadius: 0,
    backgroundColor: "#121212",
    paddingBottom: "env(safe-area-inset-bottom)",
  },
});

// ==========================================
// AppLayout
// ==========================================

const AppLayout = () => {
  const { mutateAsync } = useExchangeToken();
  const exchangeStarted = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState<string | null>(() =>
    sessionStorage.getItem("access_token"),
  );

  const [libraryOpen, setLibraryOpen] = useState(false);

  // ==========================================
  // Spotify OAuth Token Exchange
  // ==========================================

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

        sessionStorage.setItem(
          "access_token",
          tokenData.access_token,
        );

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

  // ==========================================
  // Mobile Navigation State
  // ==========================================

  const getCurrentTab = () => {
    if (libraryOpen || location.pathname.startsWith("/playlist")) {
      return "library";
    }

    if (location.pathname.startsWith("/search")) {
      return "search";
    }

    return "home";
  };

  const handleMobileNavigation = (
    _event: React.SyntheticEvent,
    newValue: string,
  ) => {
    if (newValue === "library") {
      setLibraryOpen(true);
      return;
    }

    setLibraryOpen(false);

    if (newValue === "home") {
      navigate("/");
    }

    if (newValue === "search") {
      navigate("/search");
    }
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <Layout>

      {/* ==================================
          Desktop Sidebar
      ================================== */}

      <Sidebar>

        {/* Home and Search */}

        <NavigationPanel>
          <NavList>
            <li>
              <StyledNavLink to="/" end>
                <HomeIcon />
                <Typography fontWeight={700}>
                  Home
                </Typography>
              </StyledNavLink>
            </li>

            <li>
              <StyledNavLink to="/search">
                <SearchIcon />
                <Typography fontWeight={700}>
                  Search
                </Typography>
              </StyledNavLink>
            </li>
          </NavList>
        </NavigationPanel>

        {/* Library */}

        <LibraryPanel>
          <Library accessToken={accessToken} />
        </LibraryPanel>

      </Sidebar>

      {/* ==================================
          Main Content
      ================================== */}

      <MainPanel>
        <Box
          sx={{
            position: "relative",
            minHeight: "100%",
            pb: { xs: "80px", md: 0 },
          }}
        >
          <Navbar accessToken={accessToken} />

          <Profile accessToken={accessToken} />

          <Box
            sx={{
              px: { xs: 1, md: 2 },
              pb: 2,
            }}
          >
            <Outlet context={{ accessToken }} />
          </Box>
        </Box>
      </MainPanel>

      {/* ==================================
          Mobile Bottom Navigation
      ================================== */}

      <MobileNavigation elevation={8}>
        <BottomNavigation
          value={getCurrentTab()}
          onChange={handleMobileNavigation}
          showLabels
          sx={{
            height: 64,
            backgroundColor: "#121212",

            "& .MuiBottomNavigationAction-root": {
              color: "#b3b3b3",
              minWidth: 0,
              padding: "6px 0",
            },

            "& .Mui-selected": {
              color: "#fff",
            },

            "& .MuiBottomNavigationAction-label": {
              fontSize: "10px",
            },

            "& .Mui-selected .MuiBottomNavigationAction-label": {
              fontSize: "10px",
            },
          }}
        >
          <BottomNavigationAction
            label="Home"
            value="home"
            icon={<HomeIcon />}
          />

          <BottomNavigationAction
            label="Search"
            value="search"
            icon={<SearchIcon />}
          />

          <BottomNavigationAction
            label="Your Library"
            value="library"
            icon={<LibraryMusicIcon />}
          />
        </BottomNavigation>
      </MobileNavigation>

      {/* ==================================
          Mobile Library Drawer
      ================================== */}

      <Drawer
        anchor="bottom"
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            height: "75dvh",
            backgroundColor: "#121212",
            color: "#fff",
            borderRadius: "12px 12px 0 0",
            paddingBottom: "env(safe-area-inset-bottom)",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            overflowY: "auto",
            p: 2,
          }}
        >
          <Library accessToken={accessToken} />
        </Box>
      </Drawer>

    </Layout>
  );
};

export default AppLayout;
