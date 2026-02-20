import { useLingui } from "@lingui/react/macro";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { CorporateFare } from "@mui/icons-material";
import { Avatar, Box, Typography, useMediaQuery } from "@mui/material";
import { useConfirm } from "material-ui-confirm";

import {
  deleteOrganizationMemberMutation,
  getOrganizationMemberOptions,
  getOrganizationOptions,
} from "~/gen/api/@tanstack/react-query.gen";

import { getOrganizationMenuItems } from "~/components/app/organizations/organization-menu-items";
import { Sidebar } from "~/components/layout/sidebar";

import { auth, useSession } from "~/lib/auth";
import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute("/_app/organizations/$organizationId")({
  loader: async ({ params: { organizationId } }) => {
    await queryClient.ensureQueryData(
      getOrganizationOptions({ path: { organizationId } })
    );

    const session = await auth.getSession();

    await queryClient.ensureQueryData(
      getOrganizationMemberOptions({
        path: { organizationId, userId: session!.user.id },
      })
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { t } = useLingui();

  const session = useSession();
  const confirm = useConfirm();

  const { data: organization } = useSuspenseQuery(
    getOrganizationOptions({ path: { organizationId } })
  );

  const { data: member } = useSuspenseQuery(
    getOrganizationMemberOptions({
      path: { organizationId: organization.id, userId: session.data!.user.id },
    })
  );

  const { mutate: leaveOrganization } = useMutation({
    ...deleteOrganizationMemberMutation(),
    onSuccess: () => {
      navigate({ to: "/organizations" });
    },
  });

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const SIDEBAR_ITEMS = getOrganizationMenuItems(confirm, () => {
    leaveOrganization({
      path: { organizationId, userId: session.data!.user.id },
    });
  }).filter((item) => (item.show ? item.show(member) : true));

  return (
    <>
      {!isMobile && (
        <Sidebar
          header={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                height: 64,
                paddingX: 2,
              }}
            >
              <Avatar
                src={organization.image ?? undefined}
                sx={{ borderRadius: 1 }}
              >
                <CorporateFare />
              </Avatar>
              <Box>
                <Typography
                  noWrap
                  sx={{
                    width: 210,
                    fontWeight: 500,
                  }}
                >
                  {organization.name}
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    width: 210,
                    color: (theme) => theme.vars!.palette.text.secondary,
                    fontSize: 14,
                  }}
                >
                  {organization.description}
                </Typography>
              </Box>
            </Box>
          }
          items={SIDEBAR_ITEMS.map((item) => ({
            ...item,
            label: t(item.label),
          }))}
        />
      )}
      <Box sx={{ paddingLeft: isMobile ? 0 : "300px" }}>
        <Outlet />
      </Box>
    </>
  );
}
