import { Trans, useLingui } from "@lingui/react/macro";
import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Form } from "~/components/form";
import { auth, useSession } from "~/lib/auth";

const zChangeEmail = z.object({
  newEmail: z.string().email().min(1),
});

export const ChangeEmail = () => {
  const { t } = useLingui();

  const session = useSession();

  const { mutate: changeEmail, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof zChangeEmail>) => {
      return auth.changeEmail(data);
    },
  });

  return (
    <Form
      schema={zChangeEmail}
      onSubmit={(data) => changeEmail(data)}
      options={{ defaultValues: { newEmail: session.data!.user.email } }}
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextField
            {...register("newEmail")}
            label={t`Email`}
            error={!!errors.newEmail}
            helperText={errors.newEmail?.message}
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
