import { Container, Typography } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { GlowButton } from "../theme";
import { useRouterLink } from "../components/useRouterLink";

const NotFoundPage = ({ message = "Page not found" }: { message?: string }) => {
  const homeLink = useRouterLink("/");

  return (
    <Container sx={{ pt: 10, textAlign: "center" }}>
      <title>{`${message} | Pasindu Promod`}</title>
      <Typography variant="h4" sx={{ color: "white", fontWeight: 700, mb: 4 }}>
        {message}
      </Typography>
      <GlowButton glowVariant="secondary" startIcon={<HomeIcon />} {...homeLink}>
        Back to Home
      </GlowButton>
    </Container>
  );
};

export default NotFoundPage;
