import { useMediaQuery } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";

import { getOrganizationOptions } from "~/gen/api/@tanstack/react-query.gen";

import { OrganizationMenu } from "~/components/app/organizations/organization-menu";
import { Content } from "~/components/layout/content";
import { Header } from "~/components/layout/header";

export const Route = createFileRoute("/_app/organizations/$organizationId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId } = Route.useParams();

  const { data: organization } = useSuspenseQuery(
    getOrganizationOptions({ path: { organizationId } })
  );

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  if (!isMobile) {
    return (
      <Navigate
        to="/organizations/$organizationId/overview"
        params={{ organizationId }}
      />
    );
  }

  return (
    <>
      <Header title={organization.name} />
      <Content disablePadding>
        <OrganizationMenu organizationId={organizationId} />
      </Content>
    </>
  );
}
