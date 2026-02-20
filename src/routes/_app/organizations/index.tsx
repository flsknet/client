import { useLingui } from "@lingui/react/macro";
import { Add, Link } from "@mui/icons-material";
import { createFileRoute } from "@tanstack/react-router";

import { listOrganizationsOptions } from "~/gen/api/@tanstack/react-query.gen";

import { OrganizationList } from "~/components/app/organizations/organization-list";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";
import { HeaderAction } from "~/components/layout/header-action";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute("/_app/organizations/")({
  loader: async () => {
    await queryClient.ensureQueryData(listOrganizationsOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { t } = useLingui();

  return (
    <>
      <Header title={t`Organizations`}>
        <HeaderAction
          label={t`New`}
          icon={<Add />}
          onClick={() => {
            navigate({ to: "/organizations/new" });
          }}
        />
        <HeaderAction
          label={t`Join`}
          icon={<Link />}
          onClick={() => {
            navigate({ to: "/organizations/join" });
          }}
        />
      </Header>
      <Content disablePadding>
        <OrganizationList />
      </Content>
    </>
  );
}
