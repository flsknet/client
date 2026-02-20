import { useLingui } from "@lingui/react/macro";
import { useNavigate } from "@tanstack/react-router";

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";

import { auth } from "~/lib/auth";

import { getSettingsMenuItems } from "./settings-menu-items";

export const SettingsMenu = () => {
  const navigate = useNavigate();
  const { t } = useLingui();

  const confirm = useConfirm();

  const LIST_ITEMS = getSettingsMenuItems(confirm, () => auth.signOut());

  return (
    <List>
      {LIST_ITEMS.map((item) => (
        <ListItemButton
          onClick={() => {
            item.onClick?.();

            if (item.to) {
              navigate({ to: item.to });
            }
          }}
          key={item.label.id}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={t(item.label)} />
        </ListItemButton>
      ))}
    </List>
  );
};
