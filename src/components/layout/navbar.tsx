import type { ReactElement } from "react";

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";

interface NavbarItem {
  label: string;
  icon: ReactElement;
  to: string;
}

interface NavbarProps {
  items?: NavbarItem[];
}

export function Navbar({ items }: NavbarProps) {
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  const active = items?.find((item) => {
    return matchRoute({ to: item.to, fuzzy: true });
  });

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <Box
        component="nav"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <BottomNavigation
          value={active?.to ?? false}
          showLabels
          sx={{ background: (theme) => theme.vars!.palette.secondary.main }}
        >
          {items?.map((item) => (
            <BottomNavigationAction
              value={item.to}
              label={item.label}
              icon={item.icon}
              onClick={() => navigate({ href: item.to })}
              sx={{ "& .Mui-selected": { fontSize: "12px !important" } }}
              key={item.to}
            />
          ))}
        </BottomNavigation>
      </Box>
    );
  }

  return (
    <Box
      component="nav"
      sx={{
        background: (theme) => theme.vars!.palette.primary.main,
        width: "64px",
        height: "100%",
        paddingY: 1,
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      {items?.map((item) => (
        <IconButton
          onClick={() => navigate({ to: item.to })}
          sx={{
            width: "48px",
            height: "48px",
            "&:last-child": { marginTop: "auto" },
            "& .MuiSvgIcon-root": { color: "white", fontSize: 28 },
          }}
          key={item.to}
        >
          {item.icon}
        </IconButton>
      ))}
    </Box>
  );
}
