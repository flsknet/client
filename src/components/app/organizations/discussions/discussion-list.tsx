import { Trans, useLingui } from "@lingui/react/macro";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Comment } from "@mui/icons-material";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

import type { Discussion } from "~/gen/api";
import {
  getUserOptions,
  listDiscussionsOptions,
} from "~/gen/api/@tanstack/react-query.gen";

interface DiscussionItemProps {
  organizationId: string;
  discussion: Discussion;
}

function DiscussionItem({ organizationId, discussion }: DiscussionItemProps) {
  const navigate = useNavigate();
  const { i18n } = useLingui();

  const { data: author } = useQuery({
    ...getUserOptions({ path: { userId: discussion.createdBy! } }),
    enabled: !!discussion.createdBy,
  });

  return (
    <ListItemButton
      onClick={() => {
        navigate({
          to: "/organizations/$organizationId/discussions/$discussionId",
          params: { organizationId, discussionId: discussion.id },
        });
      }}
    >
      <ListItemText
        primary={discussion.title}
        secondary={
          <>
            <Trans>
              started at{" "}
              {i18n.date(discussion.createdAt, {
                timeStyle: "short",
                dateStyle: "medium",
              })}{" "}
              by{" "}
            </Trans>
            {author?.name ?? (
              <Typography sx={{ fontSize: 14, fontStyle: "italic" }}>
                <Trans>Deleted user</Trans>
              </Typography>
            )}
          </>
        }
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Comment />
        {discussion.commentCount}
      </Box>
    </ListItemButton>
  );
}

interface DiscussionListProps {
  organizationId: string;
}

export function DiscussionList({ organizationId }: DiscussionListProps) {
  const { data: discussions } = useSuspenseQuery(
    listDiscussionsOptions({ path: { organizationId } })
  );

  if (discussions.length == 0) {
    return <></>;
  }

  return (
    <List>
      {discussions.map((discussion) => (
        <DiscussionItem
          organizationId={organizationId}
          discussion={discussion}
          key={discussion.id}
        />
      ))}
    </List>
  );
}
