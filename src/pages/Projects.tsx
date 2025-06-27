import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
  useTheme,
  styled,
  keyframes,
  ThemeProvider,
  createTheme,
  Slide,
} from "@mui/material";
import {
  CheckCircleOutline,
  Construction,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: { main: "#6a11cb", light: "#8e2de2", dark: "#4f0a9f" },
    secondary: { main: "#2575fc", light: "#42a5f5", dark: "#1a54b9" },
  },
  typography: { fontFamily: "Inter, sans-serif" },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: "50px" } },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: "16px" } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: "8px" } },
    },
  },
});

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: `linear-gradient(-45deg,
    ${theme.palette.primary.dark},
    ${theme.palette.secondary.dark},
    ${theme.palette.primary.main},
    ${theme.palette.secondary.main})`,
  backgroundSize: "400% 400%",
  animation: `${gradientShift} 15s ease infinite`,
  zIndex: -2,
}));

const ProjectCard = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "20px",
  padding: theme.spacing(3),
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
  width: "300px",
  height: "450px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.4s ease, box-shadow 0.4s ease, filter 0.4s ease",

  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: `0 20px 60px ${theme.palette.primary.main}99`,
    filter: "brightness(1.2) contrast(1.1)",
    zIndex: 2,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "60%",
    height: "100%",
    background:
      "linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent)",
    transform: "skewX(-20deg)",
    transition: "left 0.6s ease-in-out",
    zIndex: 1,
  },

  "&:hover::after": {
    left: "150%",
  },
}));


const GlowButton = styled(Button)(({ theme, variant }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: "50px",
  textTransform: "none",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  width: "100%",
  maxWidth: 280,
  ...(variant === "primary"
    ? {
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        color: "white",
        border: "none",
        boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 30px ${theme.palette.primary.main}60`,
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
        },
      }
    : {
        backgroundColor: "transparent",
        color: "white",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.5)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 30px rgba(255, 255, 255, 0.2)",
        },
      }),
}));

const cardAppear = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const AnimatedProjectCard = styled(ProjectCard)(({ delay = 0 }) => ({
  animation: `${cardAppear} 0.5s ease forwards`,
  animationDelay: `${delay}s`,
  opacity: 0,
}));

const projectsData = [
  {
    id: 1,
    name: "Galactic Explorer",
    description: "A 3D space exploration game with procedural generation.",
    image: "https://placehold.co/400x250/8e2de2/ffffff?text=Game+1",
    techStack: ["Unity", "C#", "Blender"],
    status: "Completed",
    category: "Games",
  },
  {
    id: 2,
    name: "TaskFlow Mobile",
    description:
      "Cross-platform mobile app for efficient task management and collaboration.",
    image: "https://placehold.co/400x250/2575fc/ffffff?text=Mobile+App+1",
    techStack: ["React Native", "Firebase", "Node.js"],
    status: "Completed",
    category: "Mobile Apps",
  },
  {
    id: 3,
    name: "Portfolio V2",
    description:
      "My personal portfolio website showcasing projects and skills.",
    image: "https://placehold.co/400x250/6a11cb/ffffff?text=Web+App+1",
    techStack: ["React", "Material-UI", "Vite"],
    status: "Completed",
    category: "Web Apps",
  },
  {
    id: 4,
    name: "Cyberpunk City Builder",
    description: "A city-building simulation game set in a dystopian future.",
    image: "https://placehold.co/400x250/4f0a9f/ffffff?text=Game+2",
    techStack: ["Unreal Engine 5", "C++"],
    status: "In Development",
    category: "Games",
  },
  {
    id: 5,
    name: "E-commerce Backend",
    description: "Robust backend services for an online retail platform.",
    image: "https://placehold.co/400x250/1a54b9/ffffff?text=Web+App+2",
    techStack: ["Node.js", "Express", "MongoDB"],
    status: "Completed",
    category: "Web Apps",
  },
  {
    id: 6,
    name: "Fitness Tracker App",
    description:
      "Track your workouts, nutrition, and progress with this intuitive app.",
    image: "https://placehold.co/400x250/8e2de2/ffffff?text=Mobile+App+2",
    techStack: ["Flutter", "Dart", "Firestore"],
    status: "In Development",
    category: "Mobile Apps",
  },
];

// Tags array separate from projects to avoid coupling UI logic to projects data
const tags = ["All Projects", "Games", "Mobile Apps", "Web Apps"];

const Projects = () => {
  const currentTheme = useTheme();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All Projects");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [filter]);

  const filteredProjects = projectsData.filter(
    (p) => filter === "All Projects" || p.category === filter
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 8, sm: 10 },
          pb: { xs: 8, sm: 8 },
          overflow: "auto",
          position: "relative",
        }}
      >
        <AnimatedBackground />
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            px: { xs: 2, sm: 3, md: 4 },
            textAlign: "center",
          }}
        >
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
                variant="secondary"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/")}
                sx={{ maxWidth: 200, width: { xs: "80%", sm: "auto" } }}
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
                // Removed maxWidth to allow flexible sizing
              }}
            >
              {tags.map((tag) => (
                <GlowButton
                  key={tag}
                  variant={filter === tag ? "primary" : "secondary"}
                  onClick={() => setFilter(tag)}
                  sx={{
                    textTransform: "none",
                    px: { xs: 2.5, sm: 3 },
                    py: { xs: 1, sm: 1.2 },
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                    whiteSpace: "nowrap",
                    // No fixed width here, so buttons size naturally
                    width: "auto",
                    maxWidth: "none",
                  }}
                >
                  {tag}
                </GlowButton>
              ))}
            </Box>
          </Slide>

          {/* Projects Grid */}
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
          >
            {loaded &&
              filteredProjects.map((project, index) => (
                <Grid
                  item
                  key={project.id}
                  xs={12}
                  sm={6}
                  md={4}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    overflow: "visible",
                  }}
                >
                  <AnimatedProjectCard delay={index * 0.1}>
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
                              currentTheme.palette.success?.light || "#4CAF50",
                          }}
                        />
                      ) : (
                        <Construction
                          sx={{
                            fontSize: "1rem",
                            color:
                              currentTheme.palette.warning?.light || "#FFC107",
                          }}
                        />
                      )}
                      {project.status}
                    </Typography>
                  </AnimatedProjectCard>
                </Grid>
              ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Projects;
