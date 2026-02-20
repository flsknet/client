import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import {
  getUserOptions,
  listOrganizationMembersOptions,
  listOrganizationMembersQueryKey,
} from "~/gen/api/@tanstack/react-query.gen";

import { CreateTask } from "~/components/app/organizations/boards/tasks/create-task";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/boards/$boardId/new"
)({
  loader: async ({ params: { organizationId } }) => {
    queryClient.removeQueries({
      queryKey: listOrganizationMembersQueryKey({
        path: { organizationId },
      }),
    });

    const members = await queryClient.ensureQueryData(
      listOrganizationMembersOptions({ path: { organizationId } })
    );

    await Promise.all(
      members.map((member) => {
        return queryClient.ensureQueryData(
          getUserOptions({ path: { userId: member.userId } })
        );
      })
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
      <Header title={t`New task`} />
      <Content>
        <CreateTask organizationId={organizationId} boardId={boardId} />
      </Content>
    </>
  );
}
