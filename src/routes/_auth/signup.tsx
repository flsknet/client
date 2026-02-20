import { Trans } from "@lingui/react/macro";
import { Button, Stack, Typography } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { SignUp } from "~/components/auth/sign-up";

export const Route = createFileRoute("/_auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <Stack component="main" sx={{ gap: 1.5 }}>
      <Typography variant="h1">
        <Trans>Sign up</Trans>
      </Typography>
      <SignUp />
      <Button variant="text" onClick={() => navigate({ to: "/signin" })}>
        <Trans>Already have an account?</Trans>
      </Button>
    </Stack>
  );
}
