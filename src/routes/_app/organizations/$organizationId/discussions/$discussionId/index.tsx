import { Suspense } from "react";

import { useLingui } from "@lingui/react/macro";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Delete, Edit } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";

import {
  deleteDiscussionMutation,
  getDiscussionOptions,
} from "~/gen/api/@tanstack/react-query.gen";

import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";
import { HeaderAction } from "~/components/layout/header-action";

import { CommentList } from "~/components/app/organizations/discussions/comments/comment-list";
import { CreateComment } from "~/components/app/organizations/discussions/comments/create-comment";
import { OrganizationPermission } from "~/components/app/organizations/organization-permission";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/discussions/$discussionId/"
)({
  loader: async ({ params: { organizationId, discussionId } }) => {
    await queryClient.ensureQueryData(
      getDiscussionOptions({ path: { organizationId, discussionId } })
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId, discussionId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { t } = useLingui();
  const confirm = useConfirm();

  const { data: discussion } = useSuspenseQuery(
    getDiscussionOptions({ path: { organizationId, discussionId } })
  );

  const { mutate: deleteDiscussion } = useMutation({
    ...deleteDiscussionMutation(),
    onSuccess: () => {
      navigate({ to: "/organizations/$organizationId/discussions" });
    },
  });

  const handleDelete = async () => {
    const { confirmed } = await confirm({
      title: t`Delete discussion?`,
      description: t`Are you sure you want to delete this discussion?`,
      confirmationText: t`Delete`,
      cancellationText: t`Cancel`,
      confirmationButtonProps: {
        autoFocus: true,
        color: "error",
      },
    });

    if (confirmed) {
      deleteDiscussion({ path: { organizationId, discussionId } });
    }
  };

  return (
    <>
      <Header title={discussion.title}>
        <OrganizationPermission
          organizationId={organizationId}
          targetId={discussion.createdBy ?? undefined}
        >
          <HeaderAction
            label={t`Edit`}
            icon={<Edit />}
            onClick={() => {
              navigate({
                to: "/organizations/$organizationId/discussions/$discussionId/edit",
              });
            }}
          />
        </OrganizationPermission>
        <OrganizationPermission
          organizationId={organizationId}
          roles={["owner", "admin"]}
          targetId={discussion.createdBy ?? undefined}
        >
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
          <CommentList
            organizationId={organizationId}
            discussionId={discussionId}
          />
        </Suspense>
        <CreateComment
          organizationId={organizationId}
          discussionId={discussionId}
        />
      </Content>
    </>
  );
}
