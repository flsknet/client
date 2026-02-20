import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { CreateDiscussion } from "~/components/app/organizations/discussions/create-discussion";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/discussions/new"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();
  const { t } = useLingui();

  return (
    <>
      <Header title={t`New discussion`} />
      <Content>
        <CreateDiscussion organizationId={organizationId} />
      </Content>
    </>
  );
}
