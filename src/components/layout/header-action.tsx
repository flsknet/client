import type { ReactNode } from "react";

import {
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  useMediaQuery,
  type ButtonProps,
  type MenuItemProps,
} from "@mui/material";

interface HeaderActionProps {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  slotProps?: {
    button?: ButtonProps;
    menuItem?: MenuItemProps;
  };
}

export function HeaderAction({
  label,
  icon,
  onClick,
  slotProps,
}: HeaderActionProps) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <MenuItem
        {...slotProps?.menuItem}
        onClick={(event) => {
          slotProps?.menuItem?.onClick?.(event);
          onClick?.();
        }}
      >
        {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{label}</ListItemText>
      </MenuItem>
    );
  }

  return (
    <Button
      {...slotProps?.button}
      startIcon={icon}
      onClick={(event) => {
        slotProps?.button?.onClick?.(event);
        onClick?.();
      }}
    >
      {label}
    </Button>
  );
}
