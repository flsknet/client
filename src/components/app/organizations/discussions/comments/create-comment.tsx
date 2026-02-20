import { useRef, useState } from "react";

import { Trans } from "@lingui/react/macro";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";

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

import {
  createDiscussionCommentMutation,
  listDiscussionCommentsOptions,
} from "~/gen/api/@tanstack/react-query.gen";
import { zCreateDiscussionComment } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";
import { queryClient } from "~/lib/react-query";

interface CreateCommentProps {
  organizationId: string;
  discussionId: string;
}

export function CreateComment({
  organizationId,
  discussionId,
}: CreateCommentProps) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [editorKey, setEditorKey] = useState(0);

  const { mutate: createComment, isPending } = useMutation({
    ...createDiscussionCommentMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(
        listDiscussionCommentsOptions({
          path: { organizationId, discussionId },
        })
      );

      setEditorKey(editorKey + 1);
    },
  });

  return (
    <Form
      schema={zCreateDiscussionComment}
      onSubmit={(data) => {
        createComment({
          path: { organizationId, discussionId },
          body: data,
        });
      }}
      sx={{ marginBottom: 32 }}
    >
      {({ setValue }) => (
        <>
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
            key={editorKey}
          />
          <Button
            loading={isPending}
            type="submit"
            sx={{ marginRight: "auto" }}
          >
            <Trans context="verb">Comment</Trans>
          </Button>
        </>
      )}
    </Form>
  );
}
