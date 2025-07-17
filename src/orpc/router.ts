import { db } from "@/db";
import { authMiddleware } from "@/orpc/middlewares";
import { os } from "@orpc/server";

export const baseOS = os.$context<{ headers: Headers }>();

const ping = baseOS.handler(async () => {
  console.log("ping");
  return "ping";
});
const pong = baseOS.handler(async () => {
  const ts1 = performance.now();
  const result = await db.execute(
    "SELECT * FROM todos ORDER BY id DESC LIMIT 10",
  );
  console.log(`DB query took ${performance.now() - ts1}ms`);
  return { rows: result.rows };
});

const profile = baseOS.use(authMiddleware).handler(async ({ context }) => {
  return `Hello ${context.user.name} !`;
});

export const router = {
  ping,
  pong,
  profile,
};
export type ORPCRouter = typeof router;
