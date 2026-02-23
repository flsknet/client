import { Trans, useLingui } from "@lingui/react/macro";
import { Button, TextField } from "@mui/material";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  getBoardOptions,
  updateBoardMutation,
} from "~/gen/api/@tanstack/react-query.gen";
import { zUpdateBoardBody } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";

interface UpdateBoardProps {
  organizationId: string;
  boardId: string;
}

export function UpdateBoard({ organizationId, boardId }: UpdateBoardProps) {
  const navigate = useNavigate();
  const { t } = useLingui();

  const { data: board, isFetching } = useSuspenseQuery(
    getBoardOptions({ path: { organizationId, boardId } })
  );

  const {
    mutate: updateBoard,
    isPending,
    isSuccess,
  } = useMutation({
    ...updateBoardMutation(),
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
      schema={zUpdateBoardBody}
      onSubmit={(data) => {
        updateBoard({
          path: { organizationId, boardId },
          body: data,
        });
      }}
      options={{ defaultValues: board }}
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextField
            {...register("name")}
            label={t`Name`}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
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
