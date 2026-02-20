import { useLingui } from "@lingui/react/macro";
import { Add } from "@mui/icons-material";
import { createFileRoute } from "@tanstack/react-router";

import { listBoardsOptions } from "~/gen/api/@tanstack/react-query.gen";

import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";
import { HeaderAction } from "~/components/layout/header-action";

import { BoardList } from "~/components/app/organizations/boards/board-list";
import { OrganizationPermission } from "~/components/app/organizations/organization-permission";

import { queryClient } from "~/lib/react-query";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/boards/"
)({
  loader: async ({ params: { organizationId } }) => {
    await queryClient.ensureQueryData(
      listBoardsOptions({ path: { organizationId } })
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
      <Header title={t`Boards`}>
        <OrganizationPermission
          organizationId={organizationId}
          roles={["owner", "admin"]}
        >
          <HeaderAction
            label={t`Create`}
            icon={<Add />}
            onClick={() => {
              navigate({ to: "/organizations/$organizationId/boards/new" });
            }}
          />
        </OrganizationPermission>
      </Header>
      <Content disablePadding>
        <BoardList organizationId={organizationId} />
      </Content>
    </>
  );
}
