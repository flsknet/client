import { useRef } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Person } from "@mui/icons-material";
import { Avatar, Button, TextField } from "@mui/material";

import { Form } from "~/components/form";
import { auth, useSession } from "~/lib/auth";

const zUpdateUser = z.object({
  name: z.string().min(4),
  image: z.string().nullable().optional(),
});

export function EditProfile() {
  const { t } = useLingui();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const session = useSession();

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof zUpdateUser>) => {
      return auth.updateUser(data);
    },
  });

  return (
    <Form
      schema={zUpdateUser}
      onSubmit={(data) => updateUser(data)}
      options={{ defaultValues: session.data!.user }}
    >
      {({ register, setValue, formState: { errors } }) => (
        <>
          <Avatar
            src={session.data!.user.image ?? undefined}
            onClick={() => fileInputRef.current!.click()}
            sx={{ width: 128, height: 128, cursor: "pointer" }}
          >
            <Person />
          </Avatar>
          <input
            type="file"
            hidden
            onChange={(event) => {
              if (!event.target.files?.[0]) return;

              const fileReader = new FileReader();

              fileReader.onload = () => {
                setValue("image", fileReader.result as string);
              };

              fileReader.readAsDataURL(event.target.files[0]);
            }}
            ref={fileInputRef}
          />
          <TextField
            {...register("name")}
            label={t`Name`}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <Button
            loading={isPending}
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
