import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { orpc } from "@/orpc/react";

export const Route = createFileRoute("/demo/tanstack-query")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.orpc.profile.queryOptions(),
    );
    await context.queryClient.prefetchQuery(context.orpc.pong.queryOptions());
  },

  component: TanStackQueryDemo,
});

function TanStackQueryDemo() {
  const { data: msg } = useQuery(orpc.profile.queryOptions());
  const { data: result } = useQuery(orpc.pong.queryOptions());

  return (
    <div className="p-4">
      <p>{msg}</p>
      <ul>
        {result?.rows?.map((row) => (
          <li key={row.id}>{row.title}</li>
        ))}
      </ul>
    </div>
  );
}
