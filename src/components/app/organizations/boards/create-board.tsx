import { Trans, useLingui } from "@lingui/react/macro";
import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { createBoardMutation } from "~/gen/api/@tanstack/react-query.gen";
import { zCreateBoardBody } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";

interface CreateBoardProps {
  organizationId: string;
}

export function CreateBoard({ organizationId }: CreateBoardProps) {
  const navigate = useNavigate();
  const { t } = useLingui();

  const {
    mutate: createBoard,
    isPending,
    isSuccess,
  } = useMutation({
    ...createBoardMutation(),
    onSuccess: (board) => {
      navigate({
        to: "/organizations/$organizationId/boards/$boardId",
        params: { organizationId, boardId: board.id },
      });
    },
  });

  return (
    <Form
      schema={zCreateBoardBody}
      onSubmit={(data) => {
        createBoard({
          path: { organizationId },
          body: data,
        });
      }}
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
            <Trans>Create</Trans>
          </Button>
        </>
      )}
    </Form>
  );
}
