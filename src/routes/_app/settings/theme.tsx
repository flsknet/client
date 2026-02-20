import { Trans, useLingui } from "@lingui/react/macro";
import { Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

import { ChangeTheme } from "~/components/app/settings/theme/change-theme";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

export const Route = createFileRoute("/_app/settings/theme")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLingui();

  return (
    <>
      <Header title={t`Theme`} />
      <Content sx={{ gap: 1 }}>
        <Typography variant="h2">
          <Trans>Change theme</Trans>
        </Typography>
        <ChangeTheme />
      </Content>
    </>
  );
}
