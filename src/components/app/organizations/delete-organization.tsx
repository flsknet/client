import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Box, Button } from "@mui/material";
import { useConfirm } from "material-ui-confirm";

import { deleteOrganizationMutation } from "~/gen/api/@tanstack/react-query.gen";

interface DeleteOrganizationProps {
  organizationId: string;
}

export function DeleteOrganization({
  organizationId,
}: DeleteOrganizationProps) {
  const navigate = useNavigate();
  const { t } = useLingui();

  const confirm = useConfirm();

  const {
    mutate: deleteOrganization,
    isPending,
    isSuccess,
  } = useMutation({
    ...deleteOrganizationMutation(),
    onSuccess: () => {
      navigate({ to: "/organizations" });
    },
  });

  const handleDelete = async () => {
    const { confirmed } = await confirm({
      title: t`Delete organization?`,
      description: t`Are you sure you want to delete this organization?`,
      confirmationText: t`Delete`,
      cancellationText: t`Cancel`,
      confirmationButtonProps: {
        autoFocus: true,
        color: "error",
      },
    });

    if (confirmed) {
      deleteOrganization({ path: { organizationId } });
    }
  };

  return (
    <Box>
      <Button
        color="error"
        loading={isPending}
        disabled={isSuccess}
        onClick={handleDelete}
      >
        <Trans>Delete organization</Trans>
      </Button>
    </Box>
  );
}
