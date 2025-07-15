import { RPCLink } from "@orpc/client/fetch";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { createRouterClient } from "@orpc/server";
import type { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { router } from "@/orpc/router";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { BatchLinkPlugin } from "@orpc/client/plugins";

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(router, {
      /**
       * Provide initial context if needed.
       *
       * Because this client instance is shared across all requests,
       * only include context that's safe to reuse globally.
       * For per-request context, use middleware context or pass a function as the initial context.
       */
      context: async () => ({
        headers: getHeaders(), // provide headers if initial context required
      }),
    }),
  )
  .client((): RouterClient<typeof router> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/orpc`,
      plugins: [
        new BatchLinkPlugin({
          groups: [
            {
              condition: (options) => true,
              context: {}, // Context used for the rest of the request lifecycle
            },
          ],
        }),
      ],
    });

    return createORPCClient(link);
  });

export const client: RouterClient<typeof router> = getORPCClient();
export const orpc = createTanstackQueryUtils(client);

export type ORPCQueryClient = typeof orpc;
