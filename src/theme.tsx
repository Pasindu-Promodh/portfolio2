import { createTheme, keyframes, styled, Box, Button } from "@mui/material";

// Theme definition
export const theme = createTheme({
  palette: {
    primary: {
      main: "#6a11cb",
      light: "#8e2de2",
      dark: "#4f0a9f",
    },
    secondary: {
      main: "#2575fc",
      light: "#42a5f5",
      dark: "#1a54b9",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
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

// Animations
export const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 0.4; }
`;

// Animated background component
export const AnimatedBackground = styled(Box)(({ theme }) => ({
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

// Floating particles component
// export const FloatingElement = styled(Box)(
//   ({ delay = 0 }: { delay?: number }) => ({
//     position: "absolute",
//     width: "4px",
//     height: "4px",
//     backgroundColor: "rgba(255, 255, 255, 0.15)",
//     borderRadius: "50%",
//     animation: `${floatAnimation} ${
//       3 + Math.random() * 4
//     }s ease-in-out infinite`,
//     animationDelay: `${delay}s`,
//   })
// );

export const FloatingElement = styled(Box)(
  ({ delay = 0 }: { delay?: number }) => {
    const size = 4 + Math.random() * 5; // Between 3px and 8px
    return {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      borderRadius: "50%",
      animation: `${floatAnimation} ${3 + Math.random() * 4}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    };
  }
);


interface GlowButtonProps {
  glowVariant?: "primary" | "secondary";
}

export const GlowButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "glowVariant",
})<GlowButtonProps>(({ theme, glowVariant = "primary" }) => ({
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

  ...(glowVariant === "primary"
    ? {
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        color: "white",
        border: "none",
        boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
        "&:hover": {
          transform: "translateY(-2px)",
          //   boxShadow: `0 8px 30px ${theme.palette.primary.main}60`,
          boxShadow: "0 8px 30px rgba(255, 255, 255, 0.2)",
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
export const GlassCard = styled(Box)(({ theme }) => ({
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

export const ProjectCard = styled(Box)(({ theme }) => ({
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

export const cardAppear = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

interface AnimatedProjectCardProps {
  delay?: number;
}

export const AnimatedProjectCard = styled(
  ProjectCard
)<AnimatedProjectCardProps>(({ delay = 0 }) => ({
  animation: `${cardAppear} 0.5s ease forwards`,
  animationDelay: `${delay}s`,
  opacity: 0,
}));
