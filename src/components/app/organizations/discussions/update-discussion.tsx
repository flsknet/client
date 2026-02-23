import { Trans, useLingui } from "@lingui/react/macro";
import { Button, TextField } from "@mui/material";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  getDiscussionOptions,
  updateDiscussionMutation,
} from "~/gen/api/@tanstack/react-query.gen";
import { zUpdateDiscussionBody } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";

interface UpdateDiscussionProps {
  organizationId: string;
  discussionId: string;
}

export function UpdateDiscussion({
  organizationId,
  discussionId,
}: UpdateDiscussionProps) {
  const navigate = useNavigate();
  const { t } = useLingui();

  const { data: discussion, isFetching } = useSuspenseQuery(
    getDiscussionOptions({ path: { organizationId, discussionId } })
  );

  const {
    mutate: updateDiscussion,
    isPending,
    isSuccess,
  } = useMutation({
    ...updateDiscussionMutation(),
    onSuccess: () => {
      navigate({
        to: "/organizations/$organizationId/discussions/$discussionId",
        params: { organizationId, discussionId },
      });
    },
  });

  if (isFetching) {
    return <></>;
  }

  return (
    <Form
      schema={zUpdateDiscussionBody}
      onSubmit={(data) => {
        updateDiscussion({
          path: { organizationId, discussionId },
          body: data,
        });
      }}
      options={{ defaultValues: discussion }}
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextField
            {...register("title")}
            label={t`Title`}
            error={!!errors.title}
            helperText={errors.title?.message}
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
