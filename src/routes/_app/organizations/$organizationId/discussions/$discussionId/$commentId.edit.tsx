import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { getDiscussionCommentOptions } from "~/gen/api/@tanstack/react-query.gen";

import { UpdateComment } from "~/components/app/organizations/discussions/comments/update-comment";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/discussions/$discussionId/$commentId/edit"
)({
  loader: async ({ params: { organizationId, discussionId, commentId } }) => {
    await queryClient.ensureQueryData(
      getDiscussionCommentOptions({
        path: { organizationId, discussionId, commentId },
      })
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId, discussionId, commentId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { t } = useLingui();

  return (
    <>
      <Header
        title={t`Edit comment`}
        onBack={() => {
          navigate({
            to: "/organizations/$organizationId/discussions/$discussionId",
          });
        }}
      />
      <Content>
        <UpdateComment
          organizationId={organizationId}
          discussionId={discussionId}
          commentId={commentId}
        />
      </Content>
    </>
  );
}
