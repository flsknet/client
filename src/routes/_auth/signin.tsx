import { Trans } from "@lingui/react/macro";
import { Button, Stack, Typography } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { SignIn } from "~/components/auth/sign-in";

export const Route = createFileRoute("/_auth/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <Stack component="main" sx={{ gap: 1.5 }}>
      <Typography variant="h1">
        <Trans>Sign in</Trans>
      </Typography>
      <SignIn />
      <Button variant="text" onClick={() => navigate({ to: "/signup" })}>
        <Trans>Don't have an account?</Trans>
      </Button>
    </Stack>
  );
}
