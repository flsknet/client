import { Box } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

import { InvitePreview } from "~/components/app/organizations/invites/invite-preview";

export const Route = createFileRoute("/_app/invites/$inviteId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { inviteId } = Route.useParams();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <InvitePreview inviteId={inviteId} />
    </Box>
  );
}
