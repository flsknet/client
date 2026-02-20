import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import {
  getOrganizationMemberOptions,
  getOrganizationMemberQueryKey,
} from "~/gen/api/@tanstack/react-query.gen";

import { UpdateMember } from "~/components/app/organizations/members/update-member";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/settings/people/$userId/edit"
)({
  loader: async ({ params: { organizationId, userId } }) => {
    queryClient.removeQueries({
      queryKey: getOrganizationMemberQueryKey({
        path: { organizationId, userId },
      }),
    });

    await queryClient.ensureQueryData(
      getOrganizationMemberOptions({ path: { organizationId, userId } })
    );
  },
  gcTime: 0,
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId, userId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { t } = useLingui();

  return (
    <>
      <Header
        title={t`Edit member`}
        onBack={() => {
          navigate({ to: "/organizations/$organizationId/settings/people" });
        }}
      />
      <Content>
        <UpdateMember organizationId={organizationId} userId={userId} />
      </Content>
    </>
  );
}
