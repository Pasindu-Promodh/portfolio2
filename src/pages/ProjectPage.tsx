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
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { GlowButton } from "../theme";
import LightboxMediaViewer from "../components/LightboxMediaViewer";

//data
import projects from "../data/projects.json";

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentTheme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const project = projects.find((p) => p.id.toString() === id);

  useEffect(() => {
    // const timer = setTimeout(() => setLoaded(true), 50);
    // return () => clearTimeout(timer);
    window.scrollTo(0, 0);
    setLoaded(true);
  }, []);

  const gotoPage = (page: string, id?: number, scrollPos?: number) => {
    const url = id ? `${page}/${id}` : page;
    navigate(url, { state: { scrollPos } });
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

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + mediaList.length) % mediaList.length
      );
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % mediaList.length);
    }
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
                // variant="secondary"
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
                onClick={() => setLightboxIndex(0)}
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
                {mediaList.map((media, index) => (
                  <Box
                    key={index}
                    component={media.endsWith(".mp4") ? "video" : "img"}
                    src={media}
                    onClick={() => setLightboxIndex(index)}
                    sx={{
                      width: 100,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: "10px",
                      cursor: "pointer",
                      border: "2px solid rgba(255,255,255,0.2)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                      },
                    }}
                    muted
                    autoPlay={false}
                  />
                ))}
              </Box>
            </Box>
          </Slide>

          <Slide direction="up" in={loaded} timeout={1000}>
            <Box>
              {/* <Fade in={loaded} timeout={1000}> */}
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                {project.description}
              </Typography>
              {/* </Fade> */}

              {/* <Fade in={loaded} timeout={1200}> */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 1, fontWeight: 600, color: "white" }}
                >
                  Tech Stack
                </Typography>
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
              {/* </Fade> */}

              {/* <Fade in={loaded} timeout={1300}> */}
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
              {/* </Fade> */}
            </Box>
          </Slide>
        </Box>
      </Fade>

      <LightboxMediaViewer
        media={mediaList}
        open={lightboxIndex !== null}
        currentIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </Container>
  );
};

export default ProjectPage;
