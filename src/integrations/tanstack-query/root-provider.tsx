import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import { orpc } from "@/orpc/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 1000,
    },
    dehydrate: { serializeData: superjson.serialize },
    hydrate: { deserializeData: superjson.deserialize },
  },
});

export function getContext() {
  return {
    queryClient,
    orpc: orpc,
  };
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
