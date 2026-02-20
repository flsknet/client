import { Trans, useLingui } from "@lingui/react/macro";
import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Form } from "~/components/form";
import { auth } from "~/lib/auth";

const zSignUp = z.object({
  name: z.string().min(4),
  email: z.string().email().min(1),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export function SignUp() {
  const { t } = useLingui();

  const {
    mutate: signUp,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof zSignUp>) => {
      return auth.signUp.email(data);
    },
  });

  return (
    <Form
      schema={zSignUp}
      onSubmit={(data, form) => {
        if (data.password != data.confirmPassword) {
          return form.setError("confirmPassword", {
            message: t`These passwords don't match.`,
          });
        }

        signUp(data);
      }}
      sx={{ width: "300px" }}
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextField
            {...register("name")}
            label={t`Name`}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            {...register("email")}
            label={t`Email`}
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register("password")}
            label={t`Password`}
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            {...register("confirmPassword")}
            label={t`Confirm password`}
            type="password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <Button loading={isPending} disabled={isSuccess} type="submit">
            <Trans>Sign up</Trans>
          </Button>
        </>
      )}
    </Form>
  );
}
