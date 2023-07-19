import { userRouter } from "./user";
import { router } from "../trpc";
import { chatrouter } from "./chat";
import { taskRouter } from "./task";

export const appRouter = router({
  user: userRouter,
  chat: chatrouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
