import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Container,
  Slide,
  Fade,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  ArrowBackIos,
  ArrowForwardIos,
  Close,
} from "@mui/icons-material";
import { GlowButton } from "../theme";
import LightboxMediaViewer from "../components/LightboxMediaViewer";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import { PlayArrow as PlayIcon } from "@mui/icons-material";

//data
import projects from "../data/projects.json";
import { logAction } from "../Analytics/logger";

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentTheme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const project = projects.find((p) => p.id.toString() === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    logAction("Project Viewed ID: " + id + " - " + project?.name);
    setLoaded(true);
  }, []);

  const gotoPage = (page: string, id?: number, scrollPos?: number) => {
    const url = id ? `${page}/${id}` : page;
    navigate(url, { state: { scrollPos } });
  };

  const handleClick = (action: string) => {
      switch (action) {
        case "github":
          logAction("GitHub Visited ID: " + project?.id + " - " + project?.name);
          window.open(project?.github, "_blank")
          break;
        case "preview":
          logAction("Preview Visited ID: " + project?.id + " - " + project?.name);
          window.open(project?.preview, "_blank")
          break;
        default:
          console.warn("Unknown action:", action);
      }
    };

  if (!project) {
    return (
      <Container sx={{ pt: 10 }}>
        <Typography variant="h4" color="error">
          Project not found
        </Typography>
        <GlowButton onClick={() => navigate("/")}>Back to Home</GlowButton>
      </Container>
    );
  }

  const mediaList = [
    project.image,
    ...(project.images || []),
    ...(project.videos || []),
  ];

  // Handle escape key to close fullscreen and arrow keys for navigation
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullscreen();
      } else if (event.key === "ArrowLeft") {
        goToPrevImage();
      } else if (event.key === "ArrowRight") {
        goToNextImage();
      }
    };

    if (fullscreenImage) {
      document.addEventListener("keydown", handleKeydown);
      return () => document.removeEventListener("keydown", handleKeydown);
    }
  }, [fullscreenImage, currentImageIndex, mediaList]);

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  const goToPrevImage = () => {
    const prevIndex =
      currentImageIndex === 0 ? mediaList.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setFullscreenImage(mediaList[prevIndex]);
  };

  const goToNextImage = () => {
    const nextIndex =
      currentImageIndex === mediaList.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(nextIndex);
    setFullscreenImage(mediaList[nextIndex]);
  };

  const openFullscreen = (imageSrc: string) => {
    const imageIndex = mediaList.findIndex((media) => media === imageSrc);
    setCurrentImageIndex(imageIndex);
    setFullscreenImage(imageSrc);
  };

  const isYouTubeLink = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const getYouTubeId = (url: string) => {
    const match =
      url.match(/(?:youtube\.com.*v=|youtu\.be\/)([^&?]+)/) ||
      url.match(/youtube\.com\/embed\/([^?]+)/);
    return match ? match[1] : null;
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        position: "relative",
        zIndex: 1,
        px: { xs: 2, sm: 3, md: 4 },
        textAlign: "center",
        pt: { xs: 8, sm: 10 },
        pb: { xs: 8, sm: 8 },
      }}
    >
      <Fade in={loaded} timeout={1000}>
        <Box>
          <Slide direction="down" in={loaded} timeout={600}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: { xs: 4, md: 6 },
              }}
            >
              <GlowButton
                glowVariant="secondary"
                startIcon={<ArrowBack />}
                onClick={() => gotoPage("/projects")}
                sx={{
                  px: 3,
                }}
              >
                Back to Projects
              </GlowButton>
            </Box>
          </Slide>

          <Slide in={loaded} direction="left" timeout={700}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: `linear-gradient(45deg, ${currentTheme.palette.primary.light}, ${currentTheme.palette.secondary.light})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2.2rem", sm: "3rem" },
                textAlign: "center",
              }}
            >
              {project.name}
            </Typography>
          </Slide>

          <Slide in={loaded} direction="right" timeout={900}>
            <Box>
              <Box
                sx={{
                  overflow: "hidden",
                  borderRadius: "20px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                  mb: 4,
                  cursor: "pointer",
                }}
                onClick={() => openFullscreen(project.image)}
              >
                <Box
                  component="img"
                  src={project.image}
                  alt={project.name}
                  sx={{
                    display: "block",
                    width: "100%",
                    aspectRatio: "16/6",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 2,
                  mb: 4,
                }}
              >

                {mediaList.map((media, index) => {
                  const isYouTube = isYouTubeLink(media);
                  const isMP4 = media.endsWith(".mp4");
                  const thumbnailSrc = isYouTube
                    ? `https://img.youtube.com/vi/${getYouTubeId(
                        media
                      )}/hqdefault.jpg`
                    : isMP4
                    ? media // video will show frame as preview
                    : media;

                  return (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: 100,
                        height: 60,
                        borderRadius: "10px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: "2px solid rgba(255,255,255,0.2)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                        },
                      }}
                      onClick={() => openFullscreen(mediaList[index])}
                    >
                      {isMP4 ? (
                        <Box
                          component="video"
                          src={media}
                          muted
                          playsInline
                          preload="metadata"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Box
                          component="img"
                          src={thumbnailSrc}
                          alt={`Thumbnail ${index}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      {(isYouTube || isMP4) && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "white",
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            borderRadius: "50%",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <PlayIcon sx={{ fontSize: 24 }} />
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Slide>

          <Slide direction="up" in={loaded} timeout={1000}>
            <Box>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                {project.longDescription}
              </Typography>

              {/* Features List */}
              {project.features && project.features.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Box
                    component="ul"
                    sx={{
                      textAlign: "left",
                      display: "inline-block",
                      pl: 2,
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {project.features.map((feature, index) => (
                      <li key={index}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {feature}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  {project.techStack.map((tech) => (
                    <Chip
                      key={tech}
                      label={tech}
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        fontWeight: 500,
                        fontSize: "0.85rem",
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Links */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                  mb: 4,
                }}
              >
                {project.github && (
                  <GlowButton
                    glowVariant="primary"
                    startIcon={<GitHubIcon />}
                    sx={{ px: 3 }}
                    onClick={() => handleClick("github")}
                  >
                    GitHub
                  </GlowButton>
                )}
                {project.preview && (
                  <GlowButton
                    glowVariant="secondary"
                    startIcon={<LaunchIcon />}
                    sx={{ px: 3 }}
                    onClick={() => handleClick("preview")}
                  >
                    Preview
                  </GlowButton>
                )}
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                Status: <strong>{project.status}</strong>
              </Typography>
            </Box>
          </Slide>
        </Box>
      </Fade>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0, 0, 0, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "pointer",
          }}
          onClick={closeFullscreen}
        >
          {/* Close Button */}
          <IconButton
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
              zIndex: 10001,
            }}
            onClick={closeFullscreen}
          >
            <Close />
          </IconButton>

          {/* Previous Button */}
          {mediaList.length > 1 && (
            <IconButton
              sx={{
                position: "absolute",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
                zIndex: 10001,
              }}
              onClick={(e) => {
                e.stopPropagation();
                goToPrevImage();
              }}
            >
              <ArrowBackIos />
            </IconButton>
          )}

          {/* Next Button */}
          {mediaList.length > 1 && (
            <IconButton
              sx={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
                zIndex: 10001,
              }}
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          )}

          {/* Main Image */}

          {fullscreenImage.endsWith(".mp4") ? (
            <Box
              component="video"
              src={fullscreenImage}
              controls
              autoPlay
              sx={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                backgroundColor: "black",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : isYouTubeLink(fullscreenImage) ? (
            <Box
              component="iframe"
              src={`https://www.youtube.com/embed/${getYouTubeId(
                fullscreenImage
              )}?autoplay=1`}
              allow="autoplay; fullscreen"
              frameBorder="0"
              sx={{
                width: "90vw",
                height: "50vw",
                maxHeight: "90vh",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Box
              component="img"
              src={fullscreenImage}
              alt="Fullscreen view"
              sx={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {/* Image Counter */}
          {mediaList.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                px: 2,
                py: 1,
                borderRadius: 1,
                zIndex: 10001,
              }}
            >
              <Typography variant="body2">
                {currentImageIndex + 1} / {mediaList.length}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default ProjectPage;
