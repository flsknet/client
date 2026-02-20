import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Edit, MoreVert, PersonRemove } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";

import type { OrganizationMember } from "~/gen/api";
import {
  deleteOrganizationMemberMutation,
  getUserOptions,
  listOrganizationMembersOptions,
} from "~/gen/api/@tanstack/react-query.gen";

import { queryClient } from "~/lib/react-query";

import { OrganizationPermission } from "../organization-permission";

const ROLES = {
  member: msg`Member`,
  admin: msg`Admin`,
  owner: msg`Owner`,
} as const;

interface MemberItemProps {
  organizationId: string;
  member: OrganizationMember;
}

function MemberItem({ organizationId, member }: MemberItemProps) {
  const navigate = useNavigate();
  const { i18n, t } = useLingui();

  const confirm = useConfirm();
  const popupState = usePopupState({ variant: "popover" });

  const { data: user } = useQuery(
    getUserOptions({ path: { userId: member.userId } })
  );

  const { mutate: deleteMember } = useMutation({
    ...deleteOrganizationMemberMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(
        listOrganizationMembersOptions({ path: { organizationId } })
      );
    },
  });

  const handleDelete = async () => {
    const { confirmed } = await confirm({
      title: t`Kick member?`,
      description: t`Are you sure you want to kick this member?`,
      confirmationText: t`Kick`,
      cancellationText: t`Cancel`,
      confirmationButtonProps: {
        autoFocus: true,
        color: "error",
      },
    });

    if (confirmed) {
      deleteMember({ path: { organizationId, userId: member.userId } });
    }
  };

  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton {...bindTrigger(popupState)}>
            <MoreVert />
          </IconButton>
          <Menu
            {...bindMenu(popupState)}
            onClick={() => {
              popupState.close();
            }}
          >
            <OrganizationPermission
              organizationId={organizationId}
              roles={["owner"]}
            >
              <MenuItem
                disabled={member.role == "owner"}
                onClick={() => {
                  navigate({
                    to: "/organizations/$organizationId/settings/people/$userId/edit",
                    params: { organizationId, userId: member.userId },
                  });
                }}
              >
                <ListItemIcon>
                  <Edit />
                </ListItemIcon>
                <ListItemText>
                  <Trans>Edit</Trans>
                </ListItemText>
              </MenuItem>
            </OrganizationPermission>
            <MenuItem disabled={member.role === "owner"} onClick={handleDelete}>
              <ListItemIcon>
                <PersonRemove />
              </ListItemIcon>
              <ListItemText>
                <Trans>Kick</Trans>
              </ListItemText>
            </MenuItem>
          </Menu>
        </>
      }
    >
      <ListItemAvatar>
        <Avatar src={user!.image ?? undefined} />
      </ListItemAvatar>
      <ListItemText
        primary={`${user!.name} ${member.role !== "member" ? `(${t(ROLES[member.role])})` : ""}`}
        secondary={t`Joined at ${i18n.date(member.joinedAt, {
          timeStyle: "short",
          dateStyle: "medium",
        })}`}
      />
    </ListItem>
  );
}

interface MemberListProps {
  organizationId: string;
}

export function MemberList({ organizationId }: MemberListProps) {
  const { data: members } = useSuspenseQuery(
    listOrganizationMembersOptions({ path: { organizationId } })
  );

  return (
    <List>
      {members.map((member) => (
        <MemberItem
          organizationId={organizationId}
          member={member}
          key={member.userId}
        />
      ))}
    </List>
  );
}
