import { Trans, useLingui } from "@lingui/react/macro";
import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Form } from "~/components/form";
import { auth } from "~/lib/auth";

const zChangePassword = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const ChangePassword = () => {
  const { t } = useLingui();

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof zChangePassword>) => {
      return auth.changePassword(data);
    },
  });

  return (
    <Form
      schema={zChangePassword}
      onSubmit={(data, form) => {
        if (data.newPassword != data.confirmPassword) {
          return form.setError("confirmPassword", {
            message: t`These passwords don't match.`,
          });
        }

        changePassword(data);
      }}
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextField
            {...register("currentPassword")}
            label={t`Current password`}
            type="password"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
          />
          <TextField
            {...register("newPassword")}
            label={t`New password`}
            type="password"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <TextField
            {...register("confirmPassword")}
            label={t`Confirm password`}
            type="password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <Button
            loading={isPending}
            type="submit"
            sx={{ marginRight: "auto" }}
          >
            <Trans>Change</Trans>
          </Button>
        </>
      )}
    </Form>
  );
};
