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
  createBoardTaskMutation,
  getUserOptions,
  listOrganizationMembersOptions,
} from "~/gen/api/@tanstack/react-query.gen";
import { zCreateBoardTask } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";

interface CreateTaskProps {
  organizationId: string;
  boardId: string;
}

export function CreateTask({ organizationId, boardId }: CreateTaskProps) {
  const navigate = useNavigate();
  const { t } = useLingui();

  const { data: members, isFetching } = useSuspenseQuery(
    listOrganizationMembersOptions({ path: { organizationId } })
  );

  const users = useSuspenseQueries({
    queries: members.map((member) => {
      return getUserOptions({ path: { userId: member.userId } });
    }),
  });

  const {
    mutate: createTask,
    isPending,
    isSuccess,
  } = useMutation({
    ...createBoardTaskMutation(),
    onSuccess: () => {
      navigate({
        to: "/organizations/$organizationId/boards/$boardId",
        params: { organizationId, boardId },
      });
    },
  });

  if (isFetching) {
    return <></>;
  }

  return (
    <Form
      schema={zCreateBoardTask}
      onSubmit={(data) => {
        createTask({
          path: { organizationId, boardId },
          body: data,
        });
      }}
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
              defaultValue={[]}
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
            <Trans>Create</Trans>
          </Button>
        </>
      )}
    </Form>
  );
}
