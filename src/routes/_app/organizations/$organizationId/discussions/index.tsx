import { useLingui } from "@lingui/react/macro";
import { Add } from "@mui/icons-material";
import { createFileRoute } from "@tanstack/react-router";

import {
  getUserOptions,
  listDiscussionsOptions,
} from "~/gen/api/@tanstack/react-query.gen";

import { DiscussionList } from "~/components/app/organizations/discussions/discussion-list";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";
import { HeaderAction } from "~/components/layout/header-action";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/discussions/"
)({
  loader: async ({ params: { organizationId } }) => {
    const discussions = await queryClient.ensureQueryData(
      listDiscussionsOptions({ path: { organizationId } })
    );

    await Promise.all(
      discussions
        .filter((discussion) => discussion.createdBy)
        .map((discussion) => {
          return queryClient.ensureQueryData(
            getUserOptions({ path: { userId: discussion.createdBy! } })
          );
        })
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { t } = useLingui();

  return (
    <>
      <Header title={t`Discussions`}>
        <HeaderAction
          label={t`Create`}
          icon={<Add />}
          onClick={() => {
            navigate({ to: "/organizations/$organizationId/discussions/new" });
          }}
        />
      </Header>
      <Content disablePadding>
        <DiscussionList organizationId={organizationId} />
      </Content>
    </>
  );
}
