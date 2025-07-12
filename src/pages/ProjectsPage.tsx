import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Chip,
  useTheme,
  Slide,
  Fade,
} from "@mui/material";
import {
  CheckCircleOutline,
  Construction,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab, Zoom } from "@mui/material";
import { GlowButton, AnimatedProjectCard } from "../theme";

//data
import projects from "../data/projects.json";
import tags from "../data/categories.json";

const ProjectsPage = () => {
  const currentTheme = useTheme();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All Projects");
  const [loaded, setLoaded] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    // setLoaded(false);
    // const timer = setTimeout(() => setLoaded(true), 50);
    // return () => clearTimeout(timer);
    window.scrollTo(0, 0);
    setLoaded(true);
  }, [filter]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredProjects = projects.filter(
    (p) => filter === "All Projects" || p.category === filter
  );

  const gotoPage = (page: string, id?: number, scrollPos?: number) => {
    const url = id ? `${page}/${id}` : page;
    navigate(url, { state: { scrollPos } });
  };

  const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = projects.filter(
      (p) => tag === "All Projects" || p.category === tag
    ).length;
    return acc;
  }, {} as Record<string, number>);

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
                onClick={() => gotoPage("/")}
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
            <Grid
              container
              spacing={4}
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
              {loaded &&
                filteredProjects.map((project, index) => (
                  <Box
                    key={project.id}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <AnimatedProjectCard
                      delay={index * 0.1}
                      onClick={() => gotoPage("/project", project.id)}
                      sx={{ cursor: "pointer" }}
                    >
                      <Box
                        component="img"
                        src={project.image}
                        alt={project.name}
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
                ))}
            </Grid>
          </Slide>
        </Box>
      </Fade>
      <Zoom in={showScroll}>
        <Box
          onClick={scrollToTop}
          role="presentation"
          sx={{
            position: "fixed",
            bottom: { xs: 24, sm: 32 },
            right: { xs: 24, sm: 32 },
            zIndex: 1500,
          }}
        >
          <Fab
            color="primary"
            size="medium"
            aria-label="scroll back to top"
            sx={{ boxShadow: 4 }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Box>
      </Zoom>
    </Container>
  );
};

export default ProjectsPage;
