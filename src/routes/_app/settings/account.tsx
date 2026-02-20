import { Trans, useLingui } from "@lingui/react/macro";
import { Stack, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

import { ChangeEmail } from "~/components/app/settings/account/change-email";
import { ChangePassword } from "~/components/app/settings/account/change-password";
import { DeleteAccount } from "~/components/app/settings/account/delete-account";
import { EditProfile } from "~/components/app/settings/account/edit-profile";

export const Route = createFileRoute("/_app/settings/account")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLingui();

  return (
    <>
      <Header title={t`Account`} />
      <Content sx={{ gap: 4 }}>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h2">
            <Trans>Edit profile</Trans>
          </Typography>
          <EditProfile />
        </Stack>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h2">
            <Trans>Change email</Trans>
          </Typography>
          <ChangeEmail />
        </Stack>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h2">
            <Trans>Change password</Trans>
          </Typography>
          <ChangePassword />
        </Stack>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h2">
            <Trans>Delete account</Trans>
          </Typography>
          <DeleteAccount />
        </Stack>
      </Content>
    </>
  );
}
