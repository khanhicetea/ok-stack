import { auth } from "@/lib/auth/auth-server";
import { ORPCError, os } from "@orpc/server";

export const authMiddleware = os
  .$context<{ headers: Headers }>()
  .middleware(async ({ context, next }) => {
    const auth_session = await auth.api.getSession({
      headers: context.headers,
    });

    if (auth_session?.user) {
      return await next({
        context: {
          ...context,
          session: auth_session.session,
          user: auth_session.user,
        },
      });
    }

    throw new ORPCError("UNAUTHORIZED");
  });
