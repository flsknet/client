import { useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import {
  getUserOptions,
  listOrganizationMembersOptions,
} from "~/gen/api/@tanstack/react-query.gen";

import { MemberList } from "~/components/app/organizations/members/member-list";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/settings/people/"
)({
  loader: async ({ params: { organizationId } }) => {
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
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();
  const { t } = useLingui();

  return (
    <>
      <Header title={t`People`} />
      <Content disablePadding>
        <MemberList organizationId={organizationId} />
      </Content>
    </>
  );
}
