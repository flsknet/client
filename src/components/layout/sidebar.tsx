import type { ReactElement, ReactNode } from "react";

import { Box, Tab, Tabs } from "@mui/material";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";

interface SidebarItem {
  label: string;
  icon: ReactElement;
  to?: string;
  onClick?: () => void;
}

interface SidebarProps {
  header?: ReactNode;
  items?: SidebarItem[];
}

export function Sidebar({ header, items }: SidebarProps) {
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  const active = items?.find((item) => {
    if (!item.to) {
      return false;
    }

    return matchRoute({ to: item.to, fuzzy: true });
  });

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: "64px",
        background: (theme) => theme.vars!.palette.secondary.main,
        width: "300px",
        height: "100vh",
        borderRightWidth: 1,
        borderRightColor: (theme) => theme.vars!.palette.divider,
        borderRightStyle: "solid",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {header}
      <Tabs orientation="vertical" value={active?.to ?? false}>
        {items?.map((item) => (
          <Tab
            value={item.to}
            label={item.label}
            icon={item.icon}
            iconPosition="start"
            onClick={() => {
              item.onClick?.();

              if (item.to) {
                navigate({ href: item.to });
              }
            }}
            sx={{
              justifyContent: "start",
              height: "52px",
              minHeight: "52px",
              "& .MuiTab-icon": { marginRight: 2 },
            }}
            key={item.label}
          />
        ))}
      </Tabs>
    </Box>
  );
}
