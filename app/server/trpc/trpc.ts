import { initTRPC } from "@trpc/server";
import { Context } from "./context";
/**
 * Initialization of tRPC backend
 */
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
