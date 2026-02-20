import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import {
  getBoardTaskOptions,
  getBoardTaskQueryKey,
  getUserOptions,
  listOrganizationMembersOptions,
  listOrganizationMembersQueryKey,
} from "~/gen/api/@tanstack/react-query.gen";

import { UpdateTask } from "~/components/app/organizations/boards/tasks/update-task";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/boards/$boardId/$taskId/edit"
)({
  loader: async ({ params: { organizationId, boardId, taskId } }) => {
    queryClient.removeQueries({
      queryKey: getBoardTaskQueryKey({
        path: { organizationId, boardId, taskId },
      }),
    });

    await queryClient.ensureQueryData(
      getBoardTaskOptions({ path: { organizationId, boardId, taskId } })
    );

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
  const { organizationId, boardId, taskId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { t } = useLingui();

  return (
    <>
      <Header
        title={t`Edit task`}
        onBack={() => {
          navigate({ to: "/organizations/$organizationId/boards/$boardId" });
        }}
      />
      <Content>
        <UpdateTask
          organizationId={organizationId}
          boardId={boardId}
          taskId={taskId}
        />
      </Content>
    </>
  );
}
