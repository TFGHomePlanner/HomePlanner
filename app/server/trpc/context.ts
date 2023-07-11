import * as trpc from "@trpc/server";
import { prisma } from "../../common/prisma";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { appRouter } from "./router/_app";

export async function createContext(
  ctx: trpcExpress.CreateExpressContextOptions
) {
  const { req, res } = ctx;
  return {
    req,
    res,
    prisma,
  };
}

const app = express();
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.listen(4000);

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
