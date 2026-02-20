import { Trans, useLingui } from "@lingui/react/macro";
import { Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

import { ChangeLanguage } from "~/components/app/settings/language/change-language";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

export const Route = createFileRoute("/_app/settings/language")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLingui();

  return (
    <>
      <Header title={t`Language`} />
      <Content sx={{ gap: 1 }}>
        <Typography variant="h2">
          <Trans>Change language</Trans>
        </Typography>
        <ChangeLanguage />
      </Content>
    </>
  );
}
