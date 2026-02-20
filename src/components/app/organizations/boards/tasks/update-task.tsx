import { Trans, useLingui } from "@lingui/react/macro";
import {
  useMutation,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import {
  getBoardTaskOptions,
  getUserOptions,
  listOrganizationMembersOptions,
  updateBoardTaskMutation,
} from "~/gen/api/@tanstack/react-query.gen";
import { zUpdateBoardTask } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";

interface UpdateTaskProps {
  organizationId: string;
  boardId: string;
  taskId: string;
}

export function UpdateTask({
  organizationId,
  boardId,
  taskId,
}: UpdateTaskProps) {
  const navigate = useNavigate();
  const { t } = useLingui();

  const { data: task } = useSuspenseQuery(
    getBoardTaskOptions({ path: { organizationId, boardId, taskId } })
  );

  const { data: members } = useSuspenseQuery(
    listOrganizationMembersOptions({ path: { organizationId } })
  );

  const users = useSuspenseQueries({
    queries: members.map((member) => {
      return getUserOptions({ path: { userId: member.userId } });
    }),
  });

  const {
    mutate: updateTask,
    isPending,
    isSuccess,
  } = useMutation({
    ...updateBoardTaskMutation(),
    onSuccess: () => {
      navigate({
        to: "/organizations/$organizationId/boards/$boardId",
        params: { organizationId, boardId },
      });
    },
  });

  return (
    <Form
      schema={zUpdateBoardTask}
      onSubmit={(data) => {
        updateTask({
          path: { organizationId, boardId, taskId },
          body: data,
        });
      }}
      options={{ defaultValues: task }}
    >
      {({ register, setValue, formState: { errors } }) => (
        <>
          <TextField
            {...register("title")}
            label={t`Title`}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            {...register("description")}
            label={t`Description`}
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <FormControl>
            <InputLabel>
              <Trans>Assigned to</Trans>
            </InputLabel>
            <Select
              label={t`Assigned to`}
              defaultValue={task.assignedTo}
              multiple
              onChange={(event) => {
                if (event) {
                  setValue("assignedTo", event.target.value as string[]);
                }
              }}
              error={!!errors.assignedTo}
            >
              {users.map(({ data }) => (
                <MenuItem value={data.id} key={data.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={data.image ?? undefined}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography>{data.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            loading={isPending}
            disabled={isSuccess}
            type="submit"
            sx={{ marginRight: "auto" }}
          >
            <Trans>Save</Trans>
          </Button>
        </>
      )}
    </Form>
  );
}
