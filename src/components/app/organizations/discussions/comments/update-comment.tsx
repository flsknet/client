import { useRef } from "react";

import { Trans } from "@lingui/react/macro";
import { Button } from "@mui/material";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
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

import {
  getDiscussionCommentOptions,
  updateDiscussionCommentMutation,
} from "~/gen/api/@tanstack/react-query.gen";
import { zUpdateDiscussionComment } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";

interface UpdateCommentProps {
  organizationId: string;
  discussionId: string;
  commentId: string;
}

export function UpdateComment({
  organizationId,
  discussionId,
  commentId,
}: UpdateCommentProps) {
  const navigate = useNavigate();

  const editorRef = useRef<MDXEditorMethods>(null);

  const { data: comment, isFetching } = useSuspenseQuery(
    getDiscussionCommentOptions({
      path: { organizationId, discussionId, commentId },
    })
  );

  const {
    mutate: updateComment,
    isPending,
    isSuccess,
  } = useMutation({
    ...updateDiscussionCommentMutation(),
    onSuccess: () => {
      navigate({
        to: "/organizations/$organizationId/discussions/$discussionId",
        params: { organizationId, discussionId },
      });
    },
  });

  if (isFetching) {
    return <></>;
  }

  return (
    <Form
      schema={zUpdateDiscussionComment}
      onSubmit={(data) => {
        updateComment({
          path: { organizationId, discussionId, commentId },
          body: data,
        });
      }}
      options={{ defaultValues: comment }}
    >
      {({ setValue }) => (
        <>
          <MDXEditor
            markdown={comment.content ?? ""}
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
            <Trans>Save</Trans>
          </Button>
        </>
      )}
    </Form>
  );
}
