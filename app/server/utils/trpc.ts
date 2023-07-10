import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../trpc/router/_app";

export const trpc = createTRPCReact<AppRouter>();
