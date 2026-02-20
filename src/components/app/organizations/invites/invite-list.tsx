import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { Delete, Link, MoreVert } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";

import type { OrganizationInvite } from "~/gen/api";
import {
  deleteOrganizationInviteMutation,
  listOrganizationInvitesOptions,
} from "~/gen/api/@tanstack/react-query.gen";

import { queryClient } from "~/lib/react-query";

interface InviteItemProps {
  organizationId: string;
  invite: OrganizationInvite;
}

function InviteItem({ organizationId, invite }: InviteItemProps) {
  const { i18n, t } = useLingui();
  const confirm = useConfirm();

  const popupState = usePopupState({ variant: "popover" });

  const { mutate: deleteInvite } = useMutation({
    ...deleteOrganizationInviteMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(
        listOrganizationInvitesOptions({ path: { organizationId } })
      );
    },
  });

  const handleDelete = async () => {
    const { confirmed } = await confirm({
      title: t`Delete invite?`,
      description: t`Are you sure you want to delete this invite?`,
      confirmationText: t`Delete`,
      cancellationText: t`Cancel`,
      confirmationButtonProps: {
        autoFocus: true,
        color: "error",
      },
    });

    if (confirmed) {
      deleteInvite({ path: { organizationId, inviteId: invite.id } });
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          {invite.id.toUpperCase()}
        </Typography>
      </TableCell>
      <TableCell>
        {invite.expiresAt
          ? i18n.date(invite.expiresAt, {
              timeStyle: "short",
              dateStyle: "medium",
            })
          : t`Never`}
      </TableCell>
      <TableCell>{invite.singleUse ? t`Yes` : t`No`}</TableCell>
      <TableCell align="right">
        <IconButton {...bindTrigger(popupState)}>
          <MoreVert />
        </IconButton>
        <Menu
          {...bindMenu(popupState)}
          onClick={() => {
            popupState.close();
          }}
        >
          <MenuItem
            onClick={() => {
              const origin = window.location.origin;
              navigator.clipboard.writeText(`${origin}/invites/${invite.id}`);
            }}
          >
            <ListItemIcon>
              <Link />
            </ListItemIcon>
            <ListItemText>
              <Trans context="verb">Copy</Trans>
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>
              <Trans>Delete</Trans>
            </ListItemText>
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}

interface InviteListProps {
  organizationId: string;
}

export function InviteList({ organizationId }: InviteListProps) {
  const { data: invites } = useSuspenseQuery(
    listOrganizationInvitesOptions({ path: { organizationId } })
  );

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Trans>Invite code</Trans>
            </TableCell>
            <TableCell>
              <Trans>Expires at</Trans>
            </TableCell>
            <TableCell>
              <Trans>Single use</Trans>
            </TableCell>
            <TableCell sx={{ width: 0 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {invites?.map((invite) => (
            <InviteItem
              organizationId={organizationId}
              invite={invite}
              key={invite.id}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
