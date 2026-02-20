import { Trans, useLingui } from "@lingui/react/macro";
import { Stack, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

import {
  getOrganizationOptions,
  getOrganizationQueryKey,
} from "~/gen/api/@tanstack/react-query.gen";

import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

import { DeleteOrganization } from "~/components/app/organizations/delete-organization";
import { OrganizationPermission } from "~/components/app/organizations/organization-permission";
import { UpdateOrganization } from "~/components/app/organizations/update-organization";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/settings/general"
)({
  loader: async ({ params: { organizationId } }) => {
    queryClient.removeQueries({
      queryKey: getOrganizationQueryKey({ path: { organizationId } }),
    });

    await queryClient.ensureQueryData(
      getOrganizationOptions({ path: { organizationId } })
    );
  },
  gcTime: 0,
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();
  const { t } = useLingui();

  return (
    <>
      <Header title={t`General`} />
      <Content sx={{ gap: 4 }}>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h2">
            <Trans>Edit organization</Trans>
          </Typography>
          <UpdateOrganization organizationId={organizationId} />
        </Stack>
        <OrganizationPermission
          organizationId={organizationId}
          roles={["owner"]}
        >
          <Stack sx={{ gap: 2 }}>
            <Typography variant="h2">
              <Trans>Delete organization</Trans>
            </Typography>
            <DeleteOrganization organizationId={organizationId} />
          </Stack>
        </OrganizationPermission>
      </Content>
    </>
  );
}
