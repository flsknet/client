import { msg } from "@lingui/core/macro";
import { Link, People, Settings } from "@mui/icons-material";

export const ORGANIZATION_SETTINGS_ITEMS = [
  {
    label: msg`General`,
    icon: <Settings />,
    to: "/organizations/$organizationId/settings/general",
  },
  {
    label: msg`People`,
    icon: <People />,
    to: "/organizations/$organizationId/settings/people",
  },
  {
    label: msg`Invites`,
    icon: <Link />,
    to: "/organizations/$organizationId/settings/invites",
  },
];
