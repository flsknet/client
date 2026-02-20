import type { ReactNode } from "react";

import { ArrowBack, MoreVert } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";

interface HeaderMenuProps {
  children: ReactNode;
}

function HeaderMenu({ children }: HeaderMenuProps) {
  const popupState = usePopupState({ variant: "popover" });

  return (
    <>
      <IconButton
        edge="end"
        {...bindTrigger(popupState)}
        sx={{ marginLeft: "auto" }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        {...bindMenu(popupState)}
        onClick={() => {
          popupState.close();
        }}
      >
        {children}
      </Menu>
    </>
  );
}

interface HeaderProps {
  children?: ReactNode;
  title: string;
  disableBackButton?: boolean;
  onBack?: () => void;
}

export function Header({
  children,
  title,
  disableBackButton,
  onBack,
}: HeaderProps) {
  const navigate = useNavigate();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <AppBar enableColorOnDark sx={{ position: "sticky" }}>
        <Toolbar>
          {!disableBackButton && (
            <IconButton
              edge="start"
              size="large"
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  navigate({ to: ".." });
                }
              }}
              sx={{ marginRight: 1 }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h1" noWrap sx={{ fontSize: 20 }}>
            {title}
          </Typography>
          {!!children && <HeaderMenu>{children}</HeaderMenu>}
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <Box
      sx={{
        borderBottomWidth: 1,
        borderBottomColor: (theme) => theme.vars!.palette.divider,
        borderBottomStyle: "solid",
      }}
    >
      <Container
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          height: 64,
          paddingX: "16px !important",
        }}
      >
        <Typography variant="h1" sx={{ marginRight: "auto" }}>
          {title}
        </Typography>
        {children}
      </Container>
    </Box>
  );
}
