import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { CreateBoard } from "~/components/app/organizations/boards/create-board";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/boards/new"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();
  const { t } = useLingui();

  return (
    <>
      <Header title={t`New board`} />
      <Content>
        <CreateBoard organizationId={organizationId} />
      </Content>
    </>
  );
}
