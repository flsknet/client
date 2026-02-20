import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation } from "@tanstack/react-query";

import { Box, Button } from "@mui/material";
import { useConfirm } from "material-ui-confirm";

import { auth } from "~/lib/auth";

export const DeleteAccount = () => {
  const { t } = useLingui();
  const confirm = useConfirm();

  const {
    mutate: deleteAccount,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: () => auth.deleteUser(),
  });

  const handleDelete = async () => {
    const { confirmed } = await confirm({
      title: t`Delete account?`,
      description: t`Are you sure you want to delete your account?`,
      confirmationText: t`Delete`,
      cancellationText: t`Cancel`,
      confirmationButtonProps: {
        autoFocus: true,
        color: "error",
      },
    });

    if (confirmed) {
      deleteAccount();
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
        <Trans>Delete account</Trans>
      </Button>
    </Box>
  );
};
