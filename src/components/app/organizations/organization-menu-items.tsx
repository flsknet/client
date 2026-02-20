import { msg, t } from "@lingui/core/macro";
import {
  Dashboard,
  Forum,
  Logout,
  Settings,
  ViewKanban,
} from "@mui/icons-material";
import type { ConfirmOptions, ConfirmResult } from "material-ui-confirm";

import type { OrganizationMember } from "~/gen/api";

export function getOrganizationMenuItems(
  confirm: (options: ConfirmOptions) => Promise<ConfirmResult>,
  handleLeave: () => void
) {
  return [
    {
      label: msg`Overview`,
      icon: <Dashboard />,
      to: "/organizations/$organizationId/overview",
    },
    {
      label: msg`Discussions`,
      icon: <Forum />,
      to: "/organizations/$organizationId/discussions",
    },
    {
      label: msg`Boards`,
      icon: <ViewKanban />,
      to: "/organizations/$organizationId/boards",
    },
    {
      label: msg`Settings`,
      icon: <Settings />,
      to: "/organizations/$organizationId/settings",
      show: (member: OrganizationMember) => member.role != "member",
    },
    {
      label: msg`Leave`,
      icon: <Logout />,
      onClick: async () => {
        const { confirmed } = await confirm({
          title: t`Leave?`,
          description: t`Are you sure you want to leave this organization?`,
          confirmationText: t`Leave`,
          cancellationText: t`Cancel`,
          confirmationButtonProps: {
            autoFocus: true,
            color: "error",
          },
        });

        if (confirmed) {
          handleLeave();
        }
      },
      show: (member: OrganizationMember) => member.role != "owner",
    },
  ];
}
