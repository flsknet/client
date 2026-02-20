import { useLingui } from "@lingui/react/macro";
import { Add } from "@mui/icons-material";
import { createFileRoute } from "@tanstack/react-router";

import { listOrganizationInvitesOptions } from "~/gen/api/@tanstack/react-query.gen";

import { InviteList } from "~/components/app/organizations/invites/invite-list";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";
import { HeaderAction } from "~/components/layout/header-action";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/settings/invites/"
)({
  loader: async ({ params: { organizationId } }) => {
    await queryClient.ensureQueryData(
      listOrganizationInvitesOptions({ path: { organizationId } })
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { t } = useLingui();

  return (
    <>
      <Header title={t`Invites`}>
        <HeaderAction
          label={t`Create`}
          icon={<Add />}
          onClick={() => {
            navigate({
              to: "/organizations/$organizationId/settings/invites/new",
            });
          }}
        />
      </Header>
      <Content>
        <InviteList organizationId={organizationId} />
      </Content>
    </>
  );
}
