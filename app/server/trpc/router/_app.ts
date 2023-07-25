import { userRouter } from "./user";
import { router } from "../trpc";
import { chatrouter } from "./chat";
import { taskRouter } from "./task";
import {listrouter} from "./list";

export const appRouter = router({
  user: userRouter,
  chat: chatrouter,
  task: taskRouter,
  list: listrouter,
});

export type AppRouter = typeof appRouter;
