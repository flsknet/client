import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Assignment } from "@mui/icons-material";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";

import type { Board } from "~/gen/api";
import { listBoardsOptions } from "~/gen/api/@tanstack/react-query.gen";

interface BoardItemProps {
  organizationId: string;
  board: Board;
}

function BoardItem({ organizationId, board }: BoardItemProps) {
  const navigate = useNavigate();

  return (
    <ListItemButton
      onClick={() => {
        navigate({
          to: "/organizations/$organizationId/boards/$boardId",
          params: { organizationId, boardId: board.id },
        });
      }}
    >
      <ListItemText primary={board.name} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Assignment />
        {board.taskCount}
      </Box>
    </ListItemButton>
  );
}

interface BoardListProps {
  organizationId: string;
}

export function BoardList({ organizationId }: BoardListProps) {
  const { data: boards } = useSuspenseQuery(
    listBoardsOptions({ path: { organizationId } })
  );

  if (boards.length == 0) {
    return <></>;
  }

  return (
    <List>
      {boards.map((board) => (
        <BoardItem
          organizationId={organizationId}
          board={board}
          key={board.id}
        />
      ))}
    </List>
  );
}
