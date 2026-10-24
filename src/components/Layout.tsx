import { Suspense, useMemo } from "react";
import { Box, ThemeProvider, useMediaQuery } from "@mui/material";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { theme, AnimatedBackground, FloatingElement } from "../theme";
import PrivacyNotice from "./PrivacyNotice";

const Layout = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Generated once per breakpoint so particles don't jump on re-render.
  const particles = useMemo(
    () =>
      Array.from({ length: isMobile ? 20 : 50 }, () => ({
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 4 + Math.random() * 5,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      })),
    [isMobile]
  );

  return (
    <ThemeProvider theme={theme}>
      <AnimatedBackground />
      {/* Fixed, clipped layer: animated particles near the edges must never
          change the page's scroll size, or the scrollbars flicker on and off. */}
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        {particles.map(({ top, left, ...p }, i) => (
          <FloatingElement key={i} {...p} sx={{ top, left }} />
        ))}
      </Box>
      <Box sx={{ zIndex: 1, position: "relative" }}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </Box>
      <PrivacyNotice />
      <ScrollRestoration />
    </ThemeProvider>
  );
};

export default Layout;
