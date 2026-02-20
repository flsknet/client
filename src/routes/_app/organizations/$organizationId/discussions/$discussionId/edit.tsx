import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import {
  getDiscussionOptions,
  getDiscussionQueryKey,
} from "~/gen/api/@tanstack/react-query.gen";

import { UpdateDiscussion } from "~/components/app/organizations/discussions/update-discussion";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/discussions/$discussionId/edit"
)({
  loader: async ({ params: { organizationId, discussionId } }) => {
    queryClient.removeQueries({
      queryKey: getDiscussionQueryKey({
        path: { organizationId, discussionId },
      }),
    });

    await queryClient.ensureQueryData(
      getDiscussionOptions({ path: { organizationId, discussionId } })
    );
  },
  gcTime: 0,
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId, discussionId } = Route.useParams();
  const { t } = useLingui();

  return (
    <>
      <Header title={t`Edit discussion`} />
      <Content>
        <UpdateDiscussion
          organizationId={organizationId}
          discussionId={discussionId}
        />
      </Content>
    </>
  );
}
