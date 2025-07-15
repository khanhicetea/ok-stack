import { os } from "@orpc/server";

const ping = os.handler(async () => {
  console.log("ping");
  return "ping";
});
const pong = os.handler(async () => {
  console.log("pong");
  return "pong";
});

export const router = {
  ping,
  pong,
  nested: { ping, pong },
};
export type ORPCRouter = typeof router;
