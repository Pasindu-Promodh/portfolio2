import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { acknowledgeNotice, hasSeenNotice } from "../Analytics/consent";

const PrivacyNotice = () => {
  const [open, setOpen] = useState(() => !hasSeenNotice());

  if (!open) return null;

  const close = (optOut: boolean) => {
    acknowledgeNotice(optOut);
    setOpen(false);
  };

  return (
    <Box
      role="region"
      aria-label="Privacy notice"
      sx={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        mx: "auto",
        maxWidth: 560,
        zIndex: 1400,
        p: 2,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: 2,
        color: "white",
        background: "rgba(20, 10, 40, 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "16px",
      }}
    >
      <Typography variant="body2" sx={{ flex: 1 }}>
        This site uses Google Analytics and an anonymous visitor ID to see
        which projects get viewed. No personal details are collected.
      </Typography>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button size="small" sx={{ color: "white" }} onClick={() => close(true)}>
          Opt out
        </Button>
        <Button size="small" variant="contained" onClick={() => close(false)}>
          OK
        </Button>
      </Box>
    </Box>
  );
};

export default PrivacyNotice;
