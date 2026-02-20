import { msg, t } from "@lingui/core/macro";
import { Contrast, Logout, Person, Translate } from "@mui/icons-material";
import type { ConfirmOptions, ConfirmResult } from "material-ui-confirm";

export function getSettingsMenuItems(
  confirm: (options: ConfirmOptions) => Promise<ConfirmResult>,
  handleSignOut: () => void
) {
  return [
    {
      label: msg`Account`,
      icon: <Person />,
      to: "/settings/account",
    },
    {
      label: msg`Theme`,
      icon: <Contrast />,
      to: "/settings/theme",
    },
    {
      label: msg`Language`,
      icon: <Translate />,
      to: "/settings/language",
    },
    {
      label: msg`Sign out`,
      icon: <Logout />,
      onClick: async () => {
        const { confirmed } = await confirm({
          title: t`Sign out?`,
          description: t`Are you sure you want to sign out of your account?`,
          confirmationText: t`Sign out`,
          cancellationText: t`Cancel`,
          confirmationButtonProps: {
            autoFocus: true,
            color: "error",
          },
        });

        if (confirmed) {
          handleSignOut();
        }
      },
    },
  ];
}
