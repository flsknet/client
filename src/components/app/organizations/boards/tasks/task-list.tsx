import { useEffect, useState } from "react";

import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  useMutation,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";

import type { BoardTask } from "~/gen/api";
import {
  deleteBoardTaskMutation,
  getUserOptions,
  listBoardTasksOptions,
  updateBoardTaskMutation,
} from "~/gen/api/@tanstack/react-query.gen";

import { OrganizationPermission } from "~/components/app/organizations/organization-permission";
import { useSession } from "~/lib/auth";
import { queryClient } from "~/lib/react-query";

const STATUSES = {
  todo: msg`To do`,
  inprogress: msg`In progress`,
  done: msg`Done`,
} as const;

interface TaskItemProps {
  organizationId: string;
  boardId: string;
  task: BoardTask;
}

function TaskItem({ organizationId, boardId, task }: TaskItemProps) {
  const navigate = useNavigate();
  const { t } = useLingui();

  const session = useSession();

  const { ref } = useDraggable({
    id: task.id,
    disabled: task.assignedTo
      ? !task.assignedTo.includes(session.data!.user.id)
      : false,
  });

  const confirm = useConfirm();
  const popupState = usePopupState({ variant: "popover" });

  const assignees = useSuspenseQueries({
    queries:
      task.assignedTo?.map((userId) => {
        return getUserOptions({ path: { userId } });
      }) ?? [],
  });

  const { mutate: deleteTask } = useMutation({
    ...deleteBoardTaskMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(
        listBoardTasksOptions({ path: { organizationId, boardId } })
      );
    },
  });

  const handleDelete = async () => {
    const { confirmed } = await confirm({
      title: t`Delete task?`,
      description: t`Are you sure you want to delete this task?`,
      confirmationText: t`Delete`,
      cancellationText: t`Cancel`,
      confirmationButtonProps: {
        autoFocus: true,
        color: "error",
      },
    });

    if (confirmed) {
      deleteTask({ path: { organizationId, boardId, taskId: task.id } });
    }
  };

  return (
    <>
      <Card variant="outlined" sx={{ cursor: "pointer" }} ref={ref}>
        <CardHeader
          title={
            <Typography variant="h3" sx={{ marginBottom: 1 }}>
              {task.title}
            </Typography>
          }
          action={
            <OrganizationPermission
              organizationId={organizationId}
              roles={["owner", "admin"]}
            >
              <IconButton {...bindTrigger(popupState)}>
                <MoreVert />
              </IconButton>
            </OrganizationPermission>
          }
          sx={{ paddingBottom: 0 }}
        />
        <CardContent sx={{ paddingTop: 0, paddingBottom: "16px !important" }}>
          {!!task.description ? (
            <Typography
              variant="body2"
              sx={{
                color: (theme) => theme.vars!.palette.text.secondary,
                whiteSpace: "pre-wrap",
              }}
            >
              {task.description}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: (theme) => theme.vars!.palette.text.secondary,
              }}
            >
              <Trans>No description</Trans>
            </Typography>
          )}
          <AvatarGroup max={4} sx={{ flexDirection: "row", marginTop: 2 }}>
            {assignees.map(({ data }) => (
              <Tooltip title={data.name} key={data.id}>
                <Avatar
                  src={data.image ?? undefined}
                  sx={{ width: 32, height: 32 }}
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        </CardContent>
      </Card>

      <Menu
        {...bindMenu(popupState)}
        onClick={() => {
          popupState.close();
        }}
      >
        <MenuItem
          onClick={() => {
            navigate({
              to: "/organizations/$organizationId/boards/$boardId/$taskId/edit",
              params: { organizationId, boardId, taskId: task.id },
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
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>
            <Trans>Delete</Trans>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

interface TaskSectionProps {
  organizationId: string;
  boardId: string;
  status: BoardTask["status"];
  tasks: BoardTask[];
}

function TaskSection({
  organizationId,
  boardId,
  status,
  tasks,
}: TaskSectionProps) {
  const { t } = useLingui();
  const { ref } = useDroppable({ id: status });

  return (
    <Box sx={{ flex: 1, minWidth: "300px" }} ref={ref}>
      <Card
        variant="outlined"
        sx={{
          background: (theme) => theme.vars!.palette.secondary.main,
          paddingX: 2,
          paddingY: 1,
          marginBottom: 1,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 500 }}>
          {t(STATUSES[status])}
        </Typography>
      </Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {tasks.map(
          (task) =>
            task.status === status && (
              <TaskItem
                organizationId={organizationId}
                boardId={boardId}
                task={task}
                key={task.id}
              />
            )
        )}
      </Box>
    </Box>
  );
}

interface TaskListProps {
  organizationId: string;
  boardId: string;
}

export function TaskList({ organizationId, boardId }: TaskListProps) {
  const { data: tasks } = useSuspenseQuery(
    listBoardTasksOptions({ path: { organizationId, boardId } })
  );

  // This is necessary in order to render optimistic updates.
  // TODO: Find a way to do this without useEffect.
  const [optimisticTasks, setOptimisticTasks] = useState<BoardTask[]>(tasks);
  useEffect(() => setOptimisticTasks(tasks), [tasks]); // eslint-disable-line

  const { mutateAsync: updateTask } = useMutation({
    ...updateBoardTaskMutation(),
    onMutate: ({ path: { taskId }, body }) => {
      setOptimisticTasks((prev: BoardTask[]) => {
        return prev.map((task) => {
          if (task.id == taskId) {
            return { ...task, status: body.status! };
          }

          return task;
        });
      });
    },
    // Invalidate only on error to sync with actual state.
    // Invalidating on success is unnecessary and causes stuttering.
    onError: () => {
      // TODO: Find out why invalidating does nothing.
      queryClient.invalidateQueries(
        listBoardTasksOptions({ path: { organizationId, boardId } })
      );
    },
  });

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;
        if (!event.operation.target || !event.operation.source) return;

        const status = event.operation.target.id as BoardTask["status"];
        const taskId = event.operation.source.id as string;

        updateTask({
          path: { organizationId, boardId, taskId },
          body: { status },
        });
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          minHeight: "80vh",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            background: "transparent",
            width: 0,
          },
        }}
      >
        {Object.keys(STATUSES).map((status) => (
          <TaskSection
            organizationId={organizationId}
            boardId={boardId}
            status={status as BoardTask["status"]}
            tasks={optimisticTasks}
            key={status}
          />
        ))}
      </Box>
    </DragDropProvider>
  );
}
