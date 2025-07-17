import { createIsomorphicFn } from "@tanstack/react-start";
import { authClient } from "./auth-client";
import { auth } from "./auth-server";
import { getHeaders } from "@tanstack/react-start/server";

export const getCurrentUserFn = createIsomorphicFn()
  .server(() => {
    return async () => {
      console.log("fetch from server");
      const data = await auth.api.getSession({
        headers: getHeaders() as any,
      });
      return data?.user;
    };
  })
  .client(() => {
    return async () => {
      console.log("fetch from client");
      const { data } = await authClient.getSession();
      return data?.user;
    };
  });

export type CurrentUserFn = Awaited<ReturnType<typeof getCurrentUserFn>>;
