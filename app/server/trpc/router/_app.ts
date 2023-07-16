import { userRouter } from "./user";
import { router } from "../trpc";
import { chatrouter } from "./chat";

export const appRouter = router({
  user: userRouter,
  chat: chatrouter,
});

export type AppRouter = typeof appRouter;
