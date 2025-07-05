// LightboxMediaViewer.tsx
import React, { useEffect } from "react";
import { Box, IconButton, Fade, Typography } from "@mui/material";
import { Close, ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

interface LightboxMediaViewerProps {
  open: boolean;
  media: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const isVideo = (url: string) => /\.(mp4|webm|ogg)$/.test(url);

const LightboxMediaViewer: React.FC<LightboxMediaViewerProps> = ({
  open,
  media,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  if (!open) return null;

  const currentMedia = media[currentIndex];

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
    if (e.key === "Escape") onClose();
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [open, onPrev, onNext, onClose]);

  return (
    <Fade in={open}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 20, right: 20, color: "white" }}
        >
          <Close fontSize="large" />
        </IconButton>

        <IconButton
          onClick={onPrev}
          sx={{ position: "absolute", left: 20, color: "white" }}
        >
          <ArrowBackIosNew />
        </IconButton>

        

        {isVideo(currentMedia) ? (
          <Box
            component="video"
            src={currentMedia}
            controls
            autoPlay
            sx={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 2,
              boxShadow: "0 0 30px rgba(0,0,0,0.4)",
            }}
          />
        ) : (
          <Box
            component="img"
            src={currentMedia}
            alt={`media-${currentIndex}`}
            sx={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 2,
              boxShadow: "0 0 30px rgba(0,0,0,0.4)",
            }}
          />
        )}

        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "20px",
            px: 2,
            py: 0.5,
            fontWeight: 500,
            zIndex: 10,
          }}
        >
          {currentIndex + 1} / {media.length}
        </Typography>

        <IconButton
          onClick={onNext}
          sx={{ position: "absolute", right: 20, color: "white" }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Fade>
  );
};

export default LightboxMediaViewer;
