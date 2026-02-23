import { useRef } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  diffSourcePlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";

import { createOrganizationMutation } from "~/gen/api/@tanstack/react-query.gen";
import { zCreateOrganizationBody } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";

export function CreateOrganization() {
  const navigate = useNavigate();
  const { t } = useLingui();

  const editorRef = useRef<MDXEditorMethods>(null);

  const {
    mutate: createOrganization,
    isPending,
    isSuccess,
  } = useMutation({
    ...createOrganizationMutation(),
    onSuccess: (organization) => {
      navigate({
        to: "/organizations/$organizationId",
        params: { organizationId: organization.id },
      });
    },
  });

  return (
    <Form
      schema={zCreateOrganizationBody}
      onSubmit={(data) => {
        createOrganization({ body: data });
      }}
    >
      {({ register, setValue, formState: { errors } }) => (
        <>
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
            markdown=""
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
