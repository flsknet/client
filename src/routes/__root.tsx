import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ConfirmProvider } from "material-ui-confirm";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "~/lib/theme";

import { I18nProvider } from "@lingui/react";
import { i18n } from "~/lib/i18n";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "~/lib/react-query";

export const Route = createRootRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <ConfirmProvider>
            <CssBaseline />
            <Outlet />
          </ConfirmProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
