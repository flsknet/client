import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { CreateOrganization } from "~/components/app/organizations/create-organization";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

export const Route = createFileRoute("/_app/organizations/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLingui();

  return (
    <>
      <Header title={t`New organization`} />
      <Content>
        <CreateOrganization />
      </Content>
    </>
  );
}
