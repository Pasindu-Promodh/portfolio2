import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation, useHref } from "react-router-dom";
import {
  Box,
  ButtonBase,
  Typography,
  Chip,
  Container,
  Slide,
  Fade,
  useTheme,
  IconButton,
  Modal,
} from "@mui/material";
import {
  ArrowBack,
  ArrowBackIos,
  ArrowForwardIos,
  Close,
} from "@mui/icons-material";
import { GlowButton } from "../theme";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import { PlayArrow as PlayIcon } from "@mui/icons-material";
import NotFoundPage from "./NotFoundPage";

//data
import { projects, mediaUrl, type Project } from "../data/projects";
import { logAction } from "../Analytics/logger";

const externalLink = { target: "_blank", rel: "noopener noreferrer" } as const;

const isYouTubeLink = (url: string) =>
  url.includes("youtube.com") || url.includes("youtu.be");

const isVideoFile = (url: string) => url.endsWith(".mp4");

const getYouTubeId = (url: string) => {
  const match =
    url.match(/(?:youtube\.com.*v=|youtu\.be\/)([^&?]+)/) ||
    url.match(/youtube\.com\/embed\/([^?]+)/);
  return match ? match[1] : null;
};

const overlayButtonSx = {
  position: "absolute",
  color: "white",
  bgcolor: "rgba(0, 0, 0, 0.5)",
  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
  zIndex: 1,
} as const;

const ProjectPage = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id.toString() === id);

  if (!project) return <NotFoundPage message="Project not found" />;

  // Keyed so all state and the view log reset when switching projects.
  return <ProjectDetails key={project.id} project={project} />;
};

const ProjectDetails = ({ project }: { project: Project }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const projectsHref = useHref("/projects");
  const currentTheme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const mediaList = useMemo(
    () => [project.image, ...(project.images || []), ...(project.videos || [])],
    [project]
  );

  useEffect(() => {
    logAction("project", {
      projectId: project.id,
      projectName: project.name,
    });
    setLoaded(true);
  }, [project]);

  // Coming from the list: go back in history so filter and scroll are restored.
  const handleBack = (event: React.MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey)
      return;
    event.preventDefault();
    if ((location.state as { fromList?: boolean } | null)?.fromList) {
      navigate(-1);
    } else {
      navigate("/projects");
    }
  };

  const step = (delta: number) =>
    setViewerIndex((i) =>
      i === null ? i : (i + delta + mediaList.length) % mediaList.length
    );

  const handleViewerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "ArrowRight") step(1);
  };

  const viewerMedia = viewerIndex === null ? null : mediaList[viewerIndex];

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
      <title>{`${project.name} | Pasindu Promod`}</title>
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
                href={projectsHref}
                onClick={handleBack}
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
              component="h1"
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
              <ButtonBase
                aria-label={`View ${project.name} images fullscreen`}
                onClick={() => setViewerIndex(0)}
                sx={{
                  display: "block",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: "20px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                  mb: 4,
                }}
              >
                <Box
                  component="img"
                  src={mediaUrl(project.image)}
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
              </ButtonBase>

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
                  const isVideo = isVideoFile(media);
                  const thumbnailSrc = isYouTube
                    ? `https://img.youtube.com/vi/${getYouTubeId(
                        media
                      )}/hqdefault.jpg`
                    : mediaUrl(media);

                  return (
                    <ButtonBase
                      key={index}
                      aria-label={`Open ${isYouTube || isVideo ? "video" : "image"} ${index + 1} of ${mediaList.length}`}
                      sx={{
                        position: "relative",
                        width: 100,
                        height: 60,
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "2px solid rgba(255,255,255,0.2)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover, &:focus-visible": {
                          transform: "scale(1.1)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                        },
                      }}
                      onClick={() => setViewerIndex(index)}
                    >
                      {isVideo ? (
                        <Box
                          component="video"
                          src={thumbnailSrc}
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
                          alt=""
                          loading="lazy"
                          decoding="async"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      {(isYouTube || isVideo) && (
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
                    </ButtonBase>
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
                  whiteSpace: "pre-line",
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
                    href={project.github}
                    {...externalLink}
                    onClick={() =>
                      logAction("project_github", {
                        projectId: project.id,
                        projectName: project.name,
                      })
                    }
                  >
                    GitHub
                  </GlowButton>
                )}
                {project.preview && (
                  <GlowButton
                    glowVariant="secondary"
                    startIcon={<LaunchIcon />}
                    sx={{ px: 3 }}
                    href={project.preview}
                    {...externalLink}
                    onClick={() =>
                      logAction("project_preview", {
                        projectId: project.id,
                        projectName: project.name,
                      })
                    }
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

      {/* Fullscreen media viewer (Modal handles focus trap, Escape and scroll lock) */}
      <Modal
        open={viewerMedia !== null}
        onClose={() => setViewerIndex(null)}
        aria-label={`${project.name} media viewer`}
        slotProps={{ backdrop: { sx: { bgcolor: "black" } } }}
      >
        <Box
          onKeyDown={handleViewerKeyDown}
          onClick={() => setViewerIndex(null)}
          sx={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
          }}
        >
          <IconButton
            aria-label="Close viewer"
            sx={{ ...overlayButtonSx, top: 20, right: 20 }}
            onClick={() => setViewerIndex(null)}
          >
            <Close />
          </IconButton>

          {mediaList.length > 1 && (
            <>
              <IconButton
                aria-label="Previous"
                sx={{
                  ...overlayButtonSx,
                  left: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                aria-label="Next"
                sx={{
                  ...overlayButtonSx,
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
              >
                <ArrowForwardIos />
              </IconButton>
            </>
          )}

          {viewerMedia &&
            (isVideoFile(viewerMedia) ? (
              <Box
                component="video"
                key={viewerMedia}
                src={mediaUrl(viewerMedia)}
                controls
                autoPlay
                sx={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  backgroundColor: "black",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : isYouTubeLink(viewerMedia) ? (
              <Box
                component="iframe"
                key={viewerMedia}
                title={`${project.name} video`}
                src={`https://www.youtube.com/embed/${getYouTubeId(
                  viewerMedia
                )}?autoplay=1`}
                allow="autoplay; fullscreen"
                allowFullScreen
                sx={{
                  border: 0,
                  width: "90vw",
                  height: "50vw",
                  maxHeight: "90vh",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <Box
                component="img"
                src={mediaUrl(viewerMedia)}
                alt={`${project.name} ${viewerIndex! + 1} of ${mediaList.length}`}
                sx={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ))}

          {/* Image Counter */}
          {mediaList.length > 1 && viewerIndex !== null && (
            <Box
              aria-live="polite"
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
              }}
            >
              <Typography variant="body2">
                {viewerIndex + 1} / {mediaList.length}
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ProjectPage;
