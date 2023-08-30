import { initTRPC } from "@trpc/server";
import { Context } from "./context";
/**
 * Inicialización de la instancia tRPC en backend
 */
const t = initTRPC.context<Context>().create();

/**
 * Exporta el router reutilizable y helpers de ayuda
 * que pueden ser utilizados en todo el router.
 */
export const router = t.router;
export const publicProcedure = t.procedure;
