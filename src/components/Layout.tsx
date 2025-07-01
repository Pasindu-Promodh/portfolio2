import React from "react";
import { Box, ThemeProvider, useMediaQuery } from "@mui/material";
import {
  theme,
  AnimatedBackground,
  FloatingElement,
} from "../theme"; // adjust paths

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const particles = Array.from({ length: isMobile ? 20 : 50 }, (_, i) => (
    <FloatingElement
      key={i}
      delay={Math.random() * 5}
      sx={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    />
  ));

  return (
    <ThemeProvider theme={theme}>
        <AnimatedBackground />
        {particles}
        <Box sx={{ zIndex: 1, 
          position: "relative", 
          // flex: 1 
          }}>{children}</Box>
    </ThemeProvider>
  );
};

export default Layout;
