import { useRef } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  BoldItalicUnderlineToggles,
  diffSourcePlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  toolbarPlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";

import { createDiscussionMutation } from "~/gen/api/@tanstack/react-query.gen";
import { zCreateDiscussionBody } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";

interface CreateDiscussionProps {
  organizationId: string;
}

export function CreateDiscussion({ organizationId }: CreateDiscussionProps) {
  const navigate = useNavigate();
  const { t } = useLingui();

  const editorRef = useRef<MDXEditorMethods>(null);

  const {
    mutate: createDiscussion,
    isPending,
    isSuccess,
  } = useMutation({
    ...createDiscussionMutation(),
    onSuccess: (discussion) => {
      navigate({
        to: "/organizations/$organizationId/discussions/$discussionId",
        params: { organizationId, discussionId: discussion.id },
      });
    },
  });

  return (
    <Form
      schema={zCreateDiscussionBody}
      onSubmit={(data) => {
        createDiscussion({
          path: { organizationId },
          body: data,
        });
      }}
    >
      {({ register, setValue, formState: { errors } }) => (
        <>
          <TextField
            {...register("title")}
            label={t`Title`}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <MDXEditor
            markdown=""
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              markdownShortcutPlugin(),
              diffSourcePlugin({ viewMode: "source" }),
              toolbarPlugin({
                toolbarContents: () => <BoldItalicUnderlineToggles />,
              }),
            ]}
            onChange={(value) => setValue("content", value)}
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
