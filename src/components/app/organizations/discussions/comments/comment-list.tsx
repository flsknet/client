import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import MuiMarkdown from "mui-markdown";

import type { DiscussionComment } from "~/gen/api";
import {
  deleteDiscussionCommentMutation,
  getUserOptions,
  listDiscussionCommentsOptions,
} from "~/gen/api/@tanstack/react-query.gen";

import { queryClient } from "~/lib/react-query";
import { OrganizationPermission } from "../../organization-permission";

interface CommentItemProps {
  organizationId: string;
  discussionId: string;
  comment: DiscussionComment;
}

function CommentItem({
  organizationId,
  discussionId,
  comment,
}: CommentItemProps) {
  const navigate = useNavigate();
  const { i18n, t } = useLingui();

  const confirm = useConfirm();
  const popupState = usePopupState({ variant: "popover" });

  const { data: author } = useQuery({
    ...getUserOptions({ path: { userId: comment.createdBy! } }),
    enabled: !!comment.createdBy,
  });

  const { mutate: deleteComment } = useMutation({
    ...deleteDiscussionCommentMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(
        listDiscussionCommentsOptions({
          path: { organizationId, discussionId },
        })
      );
    },
  });

  const handleDelete = async () => {
    const { confirmed } = await confirm({
      title: t`Delete comment?`,
      description: t`Are you sure you want to delete this comment?`,
      confirmationText: t`Delete`,
      cancellationText: t`Cancel`,
      confirmationButtonProps: {
        autoFocus: true,
        color: "error",
      },
    });

    if (confirmed) {
      deleteComment({
        path: { organizationId, discussionId, commentId: comment.id },
      });
    }
  };

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={<Avatar src={author?.image ?? undefined} />}
        title={
          author?.name ?? (
            <Typography sx={{ fontSize: 14, fontStyle: "italic" }}>
              <Trans>Deleted user</Trans>
            </Typography>
          )
        }
        subheader={i18n.date(comment.createdAt, {
          timeStyle: "short",
          dateStyle: "medium",
        })}
        action={
          <>
            <OrganizationPermission
              organizationId={organizationId}
              targetId={comment.createdBy ?? undefined}
              roles={["owner", "admin"]}
            >
              <IconButton {...bindTrigger(popupState)}>
                <MoreVert />
              </IconButton>
            </OrganizationPermission>
            <Menu
              {...bindMenu(popupState)}
              onClick={() => {
                popupState.close();
              }}
            >
              <OrganizationPermission
                organizationId={organizationId}
                targetId={comment.createdBy ?? undefined}
              >
                <MenuItem
                  onClick={() => {
                    navigate({
                      to: "/organizations/$organizationId/discussions/$discussionId/$commentId/edit",
                      params: {
                        organizationId,
                        discussionId,
                        commentId: comment.id,
                      },
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
              <OrganizationPermission
                organizationId={organizationId}
                roles={["owner", "admin"]}
                targetId={comment.createdBy ?? undefined}
              >
                <MenuItem onClick={handleDelete}>
                  <ListItemIcon>
                    <Delete />
                  </ListItemIcon>
                  <ListItemText>
                    <Trans>Delete</Trans>
                  </ListItemText>
                </MenuItem>
              </OrganizationPermission>
            </Menu>
          </>
        }
      />
      <CardContent sx={{ paddingTop: 0, paddingBottom: "16px !important" }}>
        <MuiMarkdown>{comment.content}</MuiMarkdown>
      </CardContent>
    </Card>
  );
}

interface CommentListProps {
  organizationId: string;
  discussionId: string;
}

export function CommentList({
  organizationId,
  discussionId,
}: CommentListProps) {
  const { data: comments } = useSuspenseQuery(
    listDiscussionCommentsOptions({ path: { organizationId, discussionId } })
  );

  return (
    <Stack sx={{ gap: 2 }}>
      {comments.map((comment) => (
        <CommentItem
          organizationId={organizationId}
          discussionId={discussionId}
          comment={comment}
          key={comment.id}
        />
      ))}
    </Stack>
  );
}
