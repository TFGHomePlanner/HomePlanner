import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../trpc/router/_app";
import { httpBatchLink } from "@trpc/client";

export const trpc = createTRPCReact<AppRouter>({});