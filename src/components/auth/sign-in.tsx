import { useState } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Form } from "~/components/form";
import { auth } from "~/lib/auth";

const zSignIn = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

export function SignIn() {
  const { t } = useLingui();
  const [rememberMe, setRememberMe] = useState(true);

  const {
    mutate: signIn,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (data: z.infer<typeof zSignIn>) => {
      return auth.signIn.email({ ...data, rememberMe });
    },
  });

  return (
    <Form
      schema={zSignIn}
      onSubmit={(data) => signIn(data)}
      sx={{ width: "300px" }}
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextField
            {...register("email")}
            label={t`Email`}
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
          <FormControlLabel
            label={t`Remember me`}
            control={<Checkbox />}
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            sx={{ height: 24 }}
          />
          <Button loading={isPending} disabled={isSuccess} type="submit">
            <Trans>Sign in</Trans>
          </Button>
        </>
      )}
    </Form>
  );
}
