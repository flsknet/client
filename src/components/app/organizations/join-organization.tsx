import { Trans, useLingui } from "@lingui/react/macro";
import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { acceptOrganizationInviteMutation } from "~/gen/api/@tanstack/react-query.gen";

import { Form } from "~/components/form";

export function JoinOrganization() {
  const navigate = useNavigate();
  const { t } = useLingui();

  const {
    mutate: acceptOrganizationInvite,
    isPending,
    isSuccess,
  } = useMutation({
    ...acceptOrganizationInviteMutation(),
    onSuccess: (invitePreview) => {
      navigate({
        to: "/organizations/$organizationId",
        params: { organizationId: invitePreview.organizationId },
      });
    },
  });

  return (
    <Form
      schema={z.object({ inviteId: z.string() })}
      onSubmit={(data) => {
        acceptOrganizationInvite({
          path: { inviteId: data.inviteId.toLowerCase() },
        });
      }}
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextField
            {...register("inviteId")}
            label={t`Invite code`}
            error={!!errors.inviteId}
            helperText={errors.inviteId?.message}
          />
          <Button
            loading={isPending}
            disabled={isSuccess}
            type="submit"
            sx={{ marginRight: "auto" }}
          >
            <Trans>Join</Trans>
          </Button>
        </>
      )}
    </Form>
  );
}
