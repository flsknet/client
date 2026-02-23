import { useRef } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { CorporateFare } from "@mui/icons-material";
import { Avatar, Button, TextField } from "@mui/material";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import {
  diffSourcePlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";

import {
  getOrganizationOptions,
  updateOrganizationMutation,
} from "~/gen/api/@tanstack/react-query.gen";
import { zUpdateOrganizationBody } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";
import { queryClient } from "~/lib/react-query";

interface UpdateOrganizationProps {
  organizationId: string;
}

export function UpdateOrganization({
  organizationId,
}: UpdateOrganizationProps) {
  const { t } = useLingui();

  const editorRef = useRef<MDXEditorMethods>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: organization, isFetching } = useSuspenseQuery(
    getOrganizationOptions({ path: { organizationId } })
  );

  const { mutate: updateOrganization, isPending } = useMutation({
    ...updateOrganizationMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(
        getOrganizationOptions({ path: { organizationId } })
      );
    },
  });

  if (isFetching) {
    return <></>;
  }

  return (
    <Form
      schema={zUpdateOrganizationBody}
      onSubmit={(data) => {
        updateOrganization({
          path: { organizationId },
          body: data,
        });
      }}
      options={{ defaultValues: organization }}
    >
      {({ register, setValue, formState: { errors } }) => (
        <>
          <Avatar
            src={organization.image ?? undefined}
            onClick={() => fileInputRef.current!.click()}
            sx={{
              width: 128,
              height: 128,
              borderRadius: 1,
              cursor: "pointer",
            }}
          >
            <CorporateFare />
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
          <TextField
            {...register("description")}
            label={t`Description`}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <MDXEditor
            markdown={organization.readme ?? ""}
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              markdownShortcutPlugin(),
              diffSourcePlugin({ viewMode: "source" }),
            ]}
            onChange={(value) => setValue("readme", value)}
            ref={editorRef}
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
