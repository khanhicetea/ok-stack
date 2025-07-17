import { createIsomorphicFn } from "@tanstack/react-start";
import { authClient } from "./auth-client";
import { auth } from "./auth-server";
import { getHeaders } from "@tanstack/react-start/server";

export const getCurrentUserFn = createIsomorphicFn()
  .server(() => {
    return async () => {
      const data = await auth.api.getSession({
        headers: getHeaders() as any,
      });
      return data?.user || null;
    };
  })
  .client(() => {
    return async () => {
      const { data } = await authClient.getSession();
      return data?.user || null;
    };
  });

export type CurrentUserFn = Awaited<ReturnType<typeof getCurrentUserFn>>;
