import { Trans, useLingui } from "@lingui/react/macro";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Box, ListSubheader, useMediaQuery } from "@mui/material";
import { useConfirm } from "material-ui-confirm";

import { getSettingsMenuItems } from "~/components/app/settings/settings-menu-items";
import { Sidebar } from "~/components/layout/sidebar";

import { auth } from "~/lib/auth";

export const Route = createFileRoute("/_app/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLingui();
  const confirm = useConfirm();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const SIDEDBAR_ITEMS = getSettingsMenuItems(confirm, () => auth.signOut());

  return (
    <>
      {!isMobile && (
        <Sidebar
          header={
            <ListSubheader
              sx={{
                background: (theme) => theme.vars!.palette.secondary.main,
                height: 40,
              }}
            >
              <Trans>Settings</Trans>
            </ListSubheader>
          }
          items={SIDEDBAR_ITEMS.map((item) => ({
            ...item,
            label: t(item.label),
          }))}
        />
      )}
      <Box sx={{ paddingLeft: isMobile ? 0 : "300px" }}>
        <Outlet />
      </Box>
    </>
  );
}
