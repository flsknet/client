import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { CorporateFare } from "@mui/icons-material";
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import type { Organization } from "~/gen/api";
import { listOrganizationsOptions } from "~/gen/api/@tanstack/react-query.gen";

interface OrganizationItemProps {
  organization: Organization;
}

function OrganizationItem({ organization }: OrganizationItemProps) {
  const navigate = useNavigate();

  return (
    <ListItemButton
      onClick={() => {
        navigate({
          to: "/organizations/$organizationId",
          params: { organizationId: organization.id },
        });
      }}
    >
      <ListItemAvatar>
        <Avatar src={organization.image ?? undefined} sx={{ borderRadius: 1 }}>
          <CorporateFare />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={organization.name}
        secondary={organization.description}
      />
    </ListItemButton>
  );
}

export function OrganizationList() {
  const { data: organizations } = useSuspenseQuery(listOrganizationsOptions());

  if (organizations.length == 0) {
    return <></>;
  }

  return (
    <List>
      {organizations.map((organization) => (
        <OrganizationItem organization={organization} key={organization.id} />
      ))}
    </List>
  );
}
