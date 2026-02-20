import { createRouter } from "@tanstack/react-router";

import { ErrorFallback } from "~/components/error-fallback";
import { routeTree } from "~/routeTree.gen";

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultErrorComponent: ErrorFallback,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
