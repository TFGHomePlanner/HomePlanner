import * as trpc from "@trpc/server";
import { prisma } from "../../common/prisma";
import * as trpcExpress from "@trpc/server/adapters/express";

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

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
