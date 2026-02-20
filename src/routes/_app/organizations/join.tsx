import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { JoinOrganization } from "~/components/app/organizations/join-organization";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

export const Route = createFileRoute("/_app/organizations/join")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLingui();

  return (
    <>
      <Header title={t`Join an organization`} />
      <Content>
        <JoinOrganization />
      </Content>
    </>
  );
}
