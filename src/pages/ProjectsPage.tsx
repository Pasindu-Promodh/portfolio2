import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Chip,
  useTheme,
  Slide,
  Fade,
  Fab,
  Zoom,
} from "@mui/material";
import {
  CheckCircleOutline,
  Construction,
  Home as HomeIcon,
} from "@mui/icons-material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { GlowButton, AnimatedProjectCard } from "../theme";
import { useRouterLink } from "../components/useRouterLink";

//data
import {
  projects,
  categories as tags,
  ALL_PROJECTS,
  mediaUrl,
} from "../data/projects";
import { logAction } from "../Analytics/logger";

const tagCounts = Object.fromEntries(
  tags.map((tag) => [
    tag,
    projects.filter((p) => tag === ALL_PROJECTS || p.category === tag).length,
  ])
);

const ProjectsPage = () => {
  const currentTheme = useTheme();
  const homeLink = useRouterLink("/");
  // Filter lives in the URL so it survives visiting a project and coming back.
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const filter =
    categoryParam && tags.includes(categoryParam) ? categoryParam : ALL_PROJECTS;
  const [loaded, setLoaded] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    setLoaded(true);
    logAction("projects");

    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const setFilter = (tag: string) => {
    setSearchParams(tag === ALL_PROJECTS ? {} : { category: tag }, {
      replace: true,
      preventScrollReset: true,
    });
    window.scrollTo(0, 0);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredProjects = projects.filter(
    (p) => filter === ALL_PROJECTS || p.category === filter
  );

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
      <title>Projects | Pasindu Promod</title>
      <Fade in={loaded} timeout={1000}>
        <Box>
          {/* Back to Home - slide down */}
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
                startIcon={<HomeIcon />}
                {...homeLink}
                sx={{
                  px: 3,
                }}
              >
                Back to Home
              </GlowButton>
            </Box>
          </Slide>

          {/* Title - slide from left */}
          <Slide direction="left" in={loaded} timeout={700}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: "white",
                fontWeight: 700,
                mb: { xs: 3, md: 4 },
                background: `linear-gradient(45deg, ${currentTheme.palette.primary.light}, ${currentTheme.palette.secondary.light})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2rem", sm: "2.8rem", md: "3.5rem" },
                textAlign: "center",
              }}
            >
              My Creative Works
            </Typography>
          </Slide>

          {/* Tags below title - slide from right */}
          <Slide direction="right" in={loaded} timeout={900}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: { xs: 1.5, sm: 2 },
                mb: { xs: 5, md: 8 },
                mx: "auto",
              }}
            >
              {tags.map((tag) => (
                <GlowButton
                  key={tag}
                  glowVariant={filter === tag ? "primary" : "secondary"}
                  aria-pressed={filter === tag}
                  onClick={() => setFilter(tag)}
                  sx={{
                    textTransform: "none",
                    px: { xs: 2.5, sm: 3 },
                    py: { xs: 1, sm: 1.2 },
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                    whiteSpace: "nowrap",
                    width: "auto",
                    maxWidth: "none",
                  }}
                >
                  {`${tag} (${tagCounts[tag] ?? 0})`}
                </GlowButton>
              ))}
            </Box>
          </Slide>

          {/* Projects Grid */}
          <Slide direction="up" in={loaded} timeout={1000}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 4,
              }}
            >
              {/* Rendered on first paint so back-navigation can restore scroll. */}
              {filteredProjects.map((project, index) => (
                  <Box
                    key={project.id}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component={RouterLink}
                      to={`/project/${project.id}`}
                      state={{ fromList: true }}
                      sx={{
                        display: "block",
                        color: "inherit",
                        textDecoration: "none",
                        borderRadius: "20px",
                        "&:focus-visible": {
                          outline: "3px solid white",
                          outlineOffset: 4,
                        },
                      }}
                    >
                      <AnimatedProjectCard delay={index * 0.1}>
                        <Box
                          component="img"
                          src={mediaUrl(project.image)}
                          alt={project.name}
                          loading="lazy"
                          decoding="async"
                          sx={{
                            width: "100%",
                            height: { xs: 160, sm: 180 },
                            objectFit: "cover",
                            borderRadius: "15px",
                            mb: 2,
                            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                          }}
                        />

                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{ color: "white", fontWeight: 600, mb: 1.5 }}
                        >
                          {project.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            mb: 2,
                            lineHeight: 1.5,
                            flexGrow: 1,
                            overflow: "hidden",
                          }}
                        >
                          {project.description}
                        </Typography>
                        <Box
                          sx={{
                            mb: 2,
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
                              size="small"
                              sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                color: "rgba(255, 255, 255, 0.9)",
                                fontWeight: 500,
                                fontSize: "0.75rem",
                              }}
                            />
                          ))}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {project.status === "Completed" ? (
                            <CheckCircleOutline
                              sx={{
                                fontSize: "1rem",
                                color:
                                  currentTheme.palette.success?.light ||
                                  "#4CAF50",
                              }}
                            />
                          ) : (
                            <Construction
                              sx={{
                                fontSize: "1rem",
                                color:
                                  currentTheme.palette.warning?.light ||
                                  "#FFC107",
                              }}
                            />
                          )}
                          {project.status}
                        </Typography>
                      </AnimatedProjectCard>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Slide>
        </Box>
      </Fade>
      <Zoom in={showScroll}>
        <Fab
          color="primary"
          size="medium"
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{
            boxShadow: 4,
            position: "fixed",
            bottom: { xs: 24, sm: 32 },
            right: { xs: 24, sm: 32 },
            zIndex: 1500,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Container>
  );
};

export default ProjectsPage;
