import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import { orpc } from "@/orpc/react";
import { QueryClient } from "@tanstack/react-query";
import { getCurrentUserFn, type CurrentUserFn } from "@/lib/auth";

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3 * 1000,
      },
    },
  });

  return {
    queryClient: queryClient,
    orpc: orpc,
    getCurrentUser: async () => {
      const currentUser = await queryClient.ensureQueryData({
        queryKey: ["currentUser"],
        staleTime: 10 * 1000,
        queryFn: getCurrentUserFn(),
      });
      console.log("currnet", currentUser);

      return queryClient.getQueryData([
        "currentUser",
      ]) as ReturnType<CurrentUserFn>;
    },
  };
}

// Create a new router instance
export const createRouter = () => {
  const router = routerWithQueryClient(
    createTanstackRouter({
      routeTree,
      context: getContext(),
      scrollRestoration: true,
      defaultPreload: "intent",
      defaultPreloadStaleTime: 0,
      defaultNotFoundComponent: () => <div>Not Found</div>,
    }),
    getContext().queryClient,
  );

  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
