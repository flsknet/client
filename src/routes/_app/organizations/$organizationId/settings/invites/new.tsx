import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { CreateInvite } from "~/components/app/organizations/invites/create-invite";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/settings/invites/new"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();
  const { t } = useLingui();

  return (
    <>
      <Header title={t`New invite`} />
      <Content>
        <CreateInvite organizationId={organizationId} />
      </Content>
    </>
  );
}
