import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import {
  getBoardOptions,
  getBoardQueryKey,
} from "~/gen/api/@tanstack/react-query.gen";

import { UpdateBoard } from "~/components/app/organizations/boards/update-board";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/boards/$boardId/edit"
)({
  loader: async ({ params: { organizationId, boardId } }) => {
    queryClient.removeQueries({
      queryKey: getBoardQueryKey({ path: { organizationId, boardId } }),
    });

    await queryClient.ensureQueryData(
      getBoardOptions({ path: { organizationId, boardId } })
    );
  },
  gcTime: 0,
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId, boardId } = Route.useParams();
  const { t } = useLingui();

  return (
    <>
      <Header title={t`Edit board`} />
      <Content>
        <UpdateBoard organizationId={organizationId} boardId={boardId} />
      </Content>
    </>
  );
}
