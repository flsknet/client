import { useLingui } from "@lingui/react/macro";
import { useMediaQuery } from "@mui/material";
import { createFileRoute, Navigate } from "@tanstack/react-router";

import { SettingsMenu } from "~/components/app/settings/settings-menu";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

export const Route = createFileRoute("/_app/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLingui();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  if (!isMobile) {
    return <Navigate to="/settings/account" />;
  }

  return (
    <>
      <Header title={t`Settings`} />
      <Content disablePadding>
        <SettingsMenu />
      </Content>
    </>
  );
}
