import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Avatar,
  Fade,
  Slide,
  useTheme,
  styled,
  keyframes,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  IconButton,
} from "@mui/material";
import {
  Download,
  Code,
  Email,
} from "@mui/icons-material";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Define a custom Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6a11cb', // A vibrant purple
      light: '#8e2de2',
      dark: '#4f0a9f',
    },
    secondary: {
      main: '#2575fc', // A bright blue
      light: '#42a5f5',
      dark: '#1a54b9',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
  },
});

// Keyframe animation for the background gradient shift
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled component for the animated full-screen background
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

// Keyframe animation for small floating decorative elements
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 0.4; }
`;

// Styled component for the small floating particles
const FloatingElement = styled(Box)(({ delay = 0 }) => ({
  position: "absolute",
  width: "4px",
  height: "4px",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  borderRadius: "50%",
  animation: `${floatAnimation} ${3 + Math.random() * 4}s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}));

// Styled component for the main action buttons with glow effect
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

// Styled component for the glass-effect card (e.g., profile card)
const GlassCard = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "20px",
  padding: theme.spacing(4),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: 400,
  mx: "auto",
}));

// Main Home component
const Home: React.FC = () => {
  const currentTheme = useTheme();
  const isMobile = useMediaQuery(currentTheme.breakpoints.down("sm"));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollTop}px`;
    document.body.style.left = `-${scrollLeft}px`;
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.documentElement.style.overflow = "hidden";

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", (e) => {
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
    });

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(scrollLeft, scrollTop);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);

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

  const handleResumeClick = () => {
    console.log("Download resume functionality will be implemented here.");
  };

  const handleProjectsClick = () => {
    console.log("Navigation to projects section will be implemented here.");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 0,
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatedBackground />
        {particles}

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 6, md: 10 }, // Increased gap for desktop view
              py: { xs: 6, sm: 8 },
              mx: "auto",
            }}
          >
            {/* Left Section: Introduction Text, Social Links, and Buttons */}
            <Fade in={loaded} timeout={1000}>
              <Box
                sx={{
                  flex: 1,
                  textAlign: { xs: "center", md: "left" },
                  px: { xs: 0, md: 2 },
                  maxWidth: { xs: "100%", md: "50%" },
                }}
              >
                <Slide direction="right" in={loaded} timeout={800}>
                  <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 300, mb: 1.5 }}> {/* Reduced mb slightly */}
                    HELLO, I'M
                  </Typography>
                </Slide>
                <Slide direction="right" in={loaded} timeout={1000}>
                  <Typography
                    variant="h2"
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      mb: 1.5, // Reduced mb slightly
                      background: `linear-gradient(45deg, ${currentTheme.palette.primary.light}, ${currentTheme.palette.secondary.light})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                    }}
                  >
                    Your Name
                  </Typography>
                </Slide>
                <Slide direction="right" in={loaded} timeout={1200}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: 400,
                      mb: 3, // Kept this as a clear break
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                    }}
                  >
                    Game Developer & Software Engineer
                  </Typography>
                </Slide>
                <Slide direction="right" in={loaded} timeout={1400}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      mb: 3, // Reduced mb slightly to bring social links closer
                      lineHeight: 1.8,
                      maxWidth: { xs: "100%", sm: "500px", md: "unset" },
                      mx: { xs: "auto", md: "unset" },
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                  >
                    Passionate about creating immersive gaming experiences and robust software solutions. Specialized in
                    Unity, React, and modern web technologies.
                  </Typography>
                </Slide>

                {/* Social Links Section */}
                <Slide direction="up" in={loaded} timeout={1500}>
                  <Box
                    sx={{
                      mb: 4, // Ample space below social icons before buttons
                      display: "flex",
                      gap: 2,
                      justifyContent: { xs: "center", md: "flex-start" },
                      width: "100%",
                    }}
                  >
                    <IconButton
                      aria-label="email"
                      href="mailto:your.email@example.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": {
                          color: currentTheme.palette.primary.light,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <Email sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }} />
                    </IconButton>
                    <IconButton
                      aria-label="github"
                      href="https://github.com/your-github-profile"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": {
                          color: currentTheme.palette.secondary.light,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <GitHubIcon sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }} />
                    </IconButton>
                    <IconButton
                      aria-label="linkedin"
                      href="https://www.linkedin.com/in/your-linkedin-profile"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": {
                          color: currentTheme.palette.primary.light,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <LinkedInIcon sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }} />
                    </IconButton>
                  </Box>
                </Slide>

                {/* Action Buttons Section */}
                <Slide direction="up" in={loaded} timeout={1600}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: "center",
                      justifyContent: { xs: "center", md: "flex-start" },
                      width: "100%",
                    }}
                  >
                    <GlowButton variant="primary" startIcon={<Download />} onClick={handleResumeClick}>
                      Download Resume
                    </GlowButton>
                    <GlowButton variant="secondary" startIcon={<Code />} onClick={handleProjectsClick}>
                      View Projects
                    </GlowButton>
                  </Box>
                </Slide>
              </Box>
            </Fade>

            {/* Right Section: Profile Card */}
            <Fade in={loaded} timeout={1200}>
              <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Slide direction="left" in={loaded} timeout={1000}>
                  <GlassCard>
                    <Box sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center"
                    }}>
                      <Avatar
                        sx={{
                          width: { xs: 120, sm: 150, md: 200 },
                          height: { xs: 120, sm: 150, md: 200 },
                          mb: 3,
                          border: "4px solid rgba(255, 255, 255, 0.3)",
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                          background: `linear-gradient(45deg, ${currentTheme.palette.primary.main}, ${currentTheme.palette.secondary.main})`,
                        }}
                        src="https://placehold.co/200x200/6a11cb/ffffff?text=YN"
                        alt="Profile"
                      >
                        YN
                      </Avatar>
                      <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                        Ready to Create
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6 }}>
                        Let's build something amazing together. From interactive games to scalable web applications.
                      </Typography>
                    </Box>
                  </GlassCard>
                </Slide>
              </Box>
            </Fade>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

// Main App component that renders the Home component
function App() {
  return <Home />;
}

export default App;
