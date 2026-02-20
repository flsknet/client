import { useLingui } from "@lingui/react/macro";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";

import { ORGANIZATION_SETTINGS_ITEMS } from "./organization-settings-items";

interface OrganizationSettingsMenuProps {
  organizationId: string;
}

export function OrganizationSettingsMenu({
  organizationId,
}: OrganizationSettingsMenuProps) {
  const navigate = useNavigate();
  const { t } = useLingui();

  return (
    <List>
      {ORGANIZATION_SETTINGS_ITEMS.map((item) => (
        <ListItemButton
          onClick={() => {
            navigate({ to: item.to, params: { organizationId } });
          }}
          key={item.to}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
          <ListItemText primary={t(item.label)} />
        </ListItemButton>
      ))}
    </List>
  );
}
