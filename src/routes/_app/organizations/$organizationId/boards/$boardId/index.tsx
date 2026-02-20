import { Suspense } from "react";

import { useLingui } from "@lingui/react/macro";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Add, Delete, Edit } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";

import {
  deleteBoardMutation,
  getBoardOptions,
} from "~/gen/api/@tanstack/react-query.gen";

import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";
import { HeaderAction } from "~/components/layout/header-action";

import { TaskList } from "~/components/app/organizations/boards/tasks/task-list";
import { OrganizationPermission } from "~/components/app/organizations/organization-permission";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/boards/$boardId/"
)({
  loader: async ({ params: { organizationId, boardId } }) => {
    await queryClient.ensureQueryData(
      getBoardOptions({ path: { organizationId, boardId } })
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId, boardId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { t } = useLingui();
  const confirm = useConfirm();

  const { data: board } = useSuspenseQuery(
    getBoardOptions({ path: { organizationId, boardId } })
  );

  const { mutate: deleteBoard } = useMutation({
    ...deleteBoardMutation(),
    onSuccess: () => {
      navigate({ to: "/organizations/$organizationId/boards" });
    },
  });

  const handleDelete = async () => {
    const { confirmed } = await confirm({
      title: t`Delete board?`,
      description: t`Are you sure you want to delete this board?`,
      confirmationText: t`Delete`,
      cancellationText: t`Cancel`,
      confirmationButtonProps: {
        autoFocus: true,
        color: "error",
      },
    });

    if (confirmed) {
      deleteBoard({ path: { organizationId, boardId } });
    }
  };

  return (
    <>
      <Header title={board.name}>
        <OrganizationPermission
          organizationId={organizationId}
          roles={["owner", "admin"]}
        >
          <HeaderAction
            label={t`Add`}
            icon={<Add />}
            onClick={() => {
              navigate({
                to: "/organizations/$organizationId/boards/$boardId/new",
              });
            }}
          />
          <HeaderAction
            label={t`Edit`}
            icon={<Edit />}
            onClick={() => {
              navigate({
                to: "/organizations/$organizationId/boards/$boardId/edit",
              });
            }}
          />
          <HeaderAction
            label={t`Delete`}
            icon={<Delete />}
            onClick={handleDelete}
            slotProps={{ button: { color: "error" } }}
          />
        </OrganizationPermission>
      </Header>
      <Content>
        <Suspense>
          <TaskList organizationId={organizationId} boardId={boardId} />
        </Suspense>
      </Content>
    </>
  );
}
