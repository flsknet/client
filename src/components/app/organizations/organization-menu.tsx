import { useLingui } from "@lingui/react/macro";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { CorporateFare } from "@mui/icons-material";
import {
  Avatar,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";

import {
  deleteOrganizationMemberMutation,
  getOrganizationMemberOptions,
  getOrganizationOptions,
} from "~/gen/api/@tanstack/react-query.gen";

import { useSession } from "~/lib/auth";

import { getOrganizationMenuItems } from "./organization-menu-items";

interface OrganizationMenuProps {
  organizationId: string;
}

export const OrganizationMenu = ({ organizationId }: OrganizationMenuProps) => {
  const navigate = useNavigate();
  const { t } = useLingui();

  const confirm = useConfirm();
  const session = useSession();

  const { data: organization } = useSuspenseQuery(
    getOrganizationOptions({ path: { organizationId } })
  );

  const { data: member } = useSuspenseQuery(
    getOrganizationMemberOptions({
      path: { organizationId: organization.id, userId: session.data!.user.id },
    })
  );

  const { mutate: leaveOrganization } = useMutation({
    ...deleteOrganizationMemberMutation(),
    onSuccess: () => {
      navigate({ to: "/organizations" });
    },
  });

  const LIST_ITEMS = getOrganizationMenuItems(confirm, () => {
    leaveOrganization({
      path: { organizationId, userId: session.data!.user.id },
    });
  }).filter((item) => (item.show ? item.show(member) : true));

  return (
    <Stack>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: 2,
        }}
      >
        <Avatar
          src={organization.image ?? undefined}
          sx={{ borderRadius: 1, width: 64, height: 64 }}
        >
          <CorporateFare />
        </Avatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h2">{organization.name}</Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            {organization.description}
          </Typography>
        </Box>
      </Box>
      <List>
        {LIST_ITEMS.map((item) => (
          <ListItemButton
            onClick={() => {
              item.onClick?.();

              if (item.to) {
                navigate({ to: item.to });
              }
            }}
            key={item.to}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={t(item.label)} />
          </ListItemButton>
        ))}
      </List>
    </Stack>
  );
};
