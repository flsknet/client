import { useLingui } from "@lingui/react/macro";
import {
  createFileRoute,
  Navigate,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";

import { CorporateFare, Home, Settings } from "@mui/icons-material";
import { Box, useMediaQuery } from "@mui/material";

import { useSession } from "~/lib/auth";

import { Navbar } from "~/components/layout/navbar";
import { LoadingIndicator } from "~/components/loading-indicator";
import { LoadingView } from "~/components/loading-view";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  const routerState = useRouterState();
  const session = useSession();

  const { t } = useLingui();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  if (session.isPending) {
    return <LoadingView />;
  }

  if (!session.data) {
    return (
      <>
        <LoadingView />
        {!routerState.isLoading && <Navigate to="/signin" />}
      </>
    );
  }

  return (
    <>
      {routerState.isLoading && <LoadingIndicator />}
      <Navbar
        items={[
          {
            label: t`Home`,
            icon: <Home />,
            to: "/",
          },
          {
            label: t`Organizations`,
            icon: <CorporateFare />,
            to: "/organizations",
          },
          {
            label: t`Settings`,
            icon: <Settings />,
            to: "/settings",
          },
        ]}
      />
      <Box sx={{ paddingLeft: isMobile ? 0 : "64px" }}>
        <Outlet />
      </Box>
    </>
  );
}
