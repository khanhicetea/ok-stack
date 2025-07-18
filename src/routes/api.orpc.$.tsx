import { router } from "@/orpc/router";
import { RPCHandler } from "@orpc/server/fetch";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { BatchHandlerPlugin } from "@orpc/server/plugins";
import { db } from "@/db";

const handler = new RPCHandler(router, {
  plugins: [new BatchHandlerPlugin()],
});

async function handle({ request }: { request: Request }) {
  const { response } = await handler.handle(request, {
    prefix: "/api/orpc",
    context: {
      headers: request.headers,
      request: request,
      db: db,
    },
  });

  return response ?? new Response("Not Found", { status: 404 });
}

export const ServerRoute = createServerFileRoute("/api/orpc/$").methods({
  HEAD: handle,
  GET: handle,
  POST: handle,
  PUT: handle,
  PATCH: handle,
  DELETE: handle,
});
