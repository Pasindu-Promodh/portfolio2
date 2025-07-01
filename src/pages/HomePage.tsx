import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Avatar,
  Fade,
  Slide,
  useTheme,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Download, Code, Email } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useNavigate } from "react-router-dom";
import { GlassCard, GlowButton } from "../theme";

//data
import skills from "../data/skills.json";

// Main Home component
const HomePage: React.FC = () => {
  const currentTheme = useTheme();
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const gotoPage = (page: string, id?: number, scrollPos?: number) => {
    const url = id ? `${page}/${id}` : page;
    navigate(url, { state: { scrollPos } });
  };

  const handleResumeClick = () => {
    console.log("Download resume functionality will be implemented here.");
  };

  return (
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
          gap: { xs: 6, md: 10 },
          py: { xs: 10, sm: 8, md: 8 },
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
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: 300,
                  mb: 1.5,
                }}
              >
                HELLO, I'M
              </Typography>
            </Slide>
            <Slide direction="right" in={loaded} timeout={1000}>
              <Typography
                variant="h2"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 1.5,
                  background: `linear-gradient(45deg, ${currentTheme.palette.primary.light}, ${currentTheme.palette.secondary.light})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                }}
              >
                Pasindu Promod
              </Typography>
            </Slide>
            <Slide direction="right" in={loaded} timeout={1200}>
              <Typography
                variant="h5"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 400,
                  mb: 3,
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
                  mb: 3,
                  lineHeight: 1.8,
                  maxWidth: { xs: "100%", sm: "500px", md: "unset" },
                  mx: { xs: "auto", md: "unset" },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                Passionate about creating immersive gaming experiences and
                robust software solutions. Specialized in Unity, React, and
                modern web technologies.
              </Typography>
            </Slide>

            <Slide direction="up" in={loaded} timeout={1450}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", md: "flex-start" },
                  gap: 1.5,
                  mb: 3,
                }}
              >
                {skills.map((tech) => (
                  <Box
                    key={tech}
                    sx={{
                      px: 1.5,
                      py: 0.7,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      fontSize: "0.85rem",
                      borderRadius: "20px",
                      fontWeight: 500,
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    {tech}
                  </Box>
                ))}
              </Box>
            </Slide>

            {/* Social Links Section */}
            <Slide direction="up" in={loaded} timeout={1500}>
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  gap: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                  width: "100%",
                }}
              >
                <IconButton
                  aria-label="email"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "pasindugunathilaka96@gmail.com"
                    );
                    setCopied(true);
                  }}
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
                  href="https://github.com/Pasindu-Promodh"
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
                  href="https://www.linkedin.com/in/pasindu-gunathilaka/"
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
                  <LinkedInIcon
                    sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
                  />
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
                <GlowButton
                  glowVariant="primary"
                  startIcon={<Download />}
                  onClick={handleResumeClick}
                >
                  Download Resume
                </GlowButton>
                <GlowButton
                  glowVariant="secondary"
                  startIcon={<Code />}
                  onClick={() => gotoPage("/projects")}
                >
                  View Projects
                </GlowButton>
              </Box>
            </Slide>
          </Box>
        </Fade>

        {/* Right Section: Profile Card */}
        <Fade in={loaded} timeout={1200}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Slide direction="left" in={loaded} timeout={1000}>
              <GlassCard>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 120, sm: 150, md: 200 },
                      height: { xs: 120, sm: 150, md: 200 },
                      mb: 3,
                      border: "4px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                      background: `linear-gradient(45deg, ${currentTheme.palette.primary.main}, ${currentTheme.palette.secondary.main})`,
                    }}
                    src="https://media.licdn.com/dms/image/v2/C5603AQHHgSWg3KJmsg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1590650753720?e=1756944000&v=beta&t=iIrXJ0J-Q557jGtntFqQg9oO0XJJJvqi3hYUwKjVo6o"
                    alt="Profile"
                  >
                    YN
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 600, mb: 2 }}
                  >
                    Ready to Create
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: 1.6,
                    }}
                  >
                    Let's build something amazing together. From interactive
                    games to scalable web applications.
                  </Typography>
                </Box>
              </GlassCard>
            </Slide>
          </Box>
        </Fade>
      </Box>
      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        message="Email copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
};

export default HomePage;
