import { db } from "@/db";
import { os } from "@orpc/server";

const ping = os.handler(async () => {
  console.log("ping");
  return "ping";
});
const pong = os.handler(async () => {
  const ts1 = performance.now();
  const result = await db.execute(
    "SELECT * FROM todos ORDER BY id DESC LIMIT 10",
  );
  console.log(`DB query took ${performance.now() - ts1}ms`);
  return { rows: result.rows };
});

export const router = {
  ping,
  pong,
  nested: { ping, pong },
};
export type ORPCRouter = typeof router;
