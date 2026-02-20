import { Trans } from "@lingui/react/macro";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { CorporateFare } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  ListSubheader,
  Typography,
} from "@mui/material";

import {
  acceptOrganizationInviteMutation,
  findOrganizationInviteOptions,
} from "~/gen/api/@tanstack/react-query.gen";

interface InvitePreviewProps {
  inviteId: string;
}

export function InvitePreview({ inviteId }: InvitePreviewProps) {
  const navigate = useNavigate();

  const { data: invite } = useSuspenseQuery(
    findOrganizationInviteOptions({
      path: { inviteId: inviteId.toLowerCase() },
    })
  );

  const { mutate: acceptInvite } = useMutation({
    ...acceptOrganizationInviteMutation(),
    onSuccess: () => {
      navigate({
        to: "/organizations/$organizationId",
        params: { organizationId: invite.organization.id },
      });
    },
  });

  return (
    <Card variant="outlined" sx={{ minWidth: 300 }}>
      <ListSubheader>
        <Trans>You have been invited to join</Trans>
      </ListSubheader>
      <Divider />
      <CardHeader
        avatar={
          <Avatar
            src={invite.organization.image ?? undefined}
            sx={{ borderRadius: 1 }}
          >
            <CorporateFare />
          </Avatar>
        }
        title={
          <Typography noWrap sx={{ fontWeight: 500 }}>
            {invite.organization.name}
          </Typography>
        }
        subheader={
          <Typography
            noWrap
            sx={{
              color: (theme) => theme.vars!.palette.text.secondary,
              fontSize: 14,
            }}
          >
            {invite.organization.description}
          </Typography>
        }
      />
      <CardActions sx={{ display: "flex" }}>
        <Button
          onClick={() => {
            navigate({ to: "/" });
          }}
          sx={{ flex: 1 }}
        >
          <Trans>Decline</Trans>
        </Button>
        <Button
          onClick={() => {
            acceptInvite({ path: { inviteId: invite.id } });
          }}
          sx={{ flex: 1 }}
        >
          <Trans>Accept</Trans>
        </Button>
      </CardActions>
    </Card>
  );
}
