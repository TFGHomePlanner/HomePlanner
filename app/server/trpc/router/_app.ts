import { userRouter } from "./user";
import { router } from "../trpc";
import { chatrouter } from "./chat";
import { taskRouter } from "./task";
import { listrouter } from "./list";
import { groupRouter } from "./group";

export const appRouter = router({
  user: userRouter,
  chat: chatrouter,
  task: taskRouter,
  list: listrouter,
  group: groupRouter,
  taskGroup: taskRouter,
});

export type AppRouter = typeof appRouter;
