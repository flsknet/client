import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { OrganizationOverview } from "~/components/app/organizations/organization-overview";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/overview"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();
  const { t } = useLingui();

  return (
    <>
      <Header title={t`Overview`} />
      <Content>
        <OrganizationOverview organizationId={organizationId} />
      </Content>
    </>
  );
}
