import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { Add, Launch, Mail } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";

const CARDS = [
  {
    title: msg`Create an organization`,
    description: msg`Coordinate and collaborate with your team.`,
    icon: <Add sx={{ fontSize: 24 }} />,
    to: "/organizations/new",
  },
  {
    title: msg`Join an organization`,
    description: msg`Join an existing organization with an invite code.`,
    icon: <Mail sx={{ fontSize: 24 }} />,
    to: "/organizations/join",
  },
];

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { t } = useLingui();

  return (
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: 36 }}>
        <Trans>Welcome to </Trans>
        <Typography
          component="span"
          variant="inherit"
          sx={{ color: (theme) => theme.vars!.palette.primary.main }}
        >
          Flask
        </Typography>
      </Typography>
      <Grid
        container
        columns={{ xs: 1, md: 2 }}
        spacing={2}
        sx={{ width: 800, maxWidth: "90vw" }}
      >
        {CARDS.map((card) => (
          <Grid size={1} key={card.to}>
            <Card variant="outlined" sx={{ minHeight: "150px" }}>
              <CardHeader
                title={t(card.title)}
                avatar={card.icon}
                action={
                  <IconButton onClick={() => navigate({ to: card.to })}>
                    <Launch fontSize="small" />
                  </IconButton>
                }
                sx={{
                  "& .MuiCardHeader-title": {
                    fontSize: 18,
                    fontWeight: 500,
                  },
                }}
              />
              <CardContent sx={{ paddingTop: 0 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", fontSize: 14 }}
                >
                  {t(card.description)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
