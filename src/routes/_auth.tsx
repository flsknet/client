import { Box } from "@mui/material";
import {
  createFileRoute,
  Navigate,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";

import { LoadingView } from "~/components/loading-view";
import { useSession } from "~/lib/auth";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const routerState = useRouterState();
  const session = useSession();

  if (session.isPending) {
    return <LoadingView />;
  }

  if (session.data) {
    return (
      <>
        <LoadingView />
        {!routerState.isLoading && <Navigate to="/" />}
      </>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Outlet />
    </Box>
  );
}
