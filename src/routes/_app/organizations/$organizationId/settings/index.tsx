import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { OrganizationSettingsMenu } from "~/components/app/organizations/organization-settings";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/settings/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();
  const { t } = useLingui();

  return (
    <>
      <Header title={t`Settings`} />
      <Content disablePadding>
        <OrganizationSettingsMenu organizationId={organizationId} />
      </Content>
    </>
  );
}
