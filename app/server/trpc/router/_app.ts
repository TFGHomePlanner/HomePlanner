import { userRouter } from "./user";
import { router } from "../trpc";
import { chatrouter } from "./chat";
import { taskRouter } from "./task";
import { listrouter } from "./list";
import { groupRouter } from "./group";
import { sharedNoteRouter } from "./sharedNote";
import { paymentRouter } from "./payment";
import { eventRouter } from "./event";

export const appRouter = router({
  user: userRouter,
  chat: chatrouter,
  task: taskRouter,
  event: eventRouter,
  list: listrouter,
  group: groupRouter,
  taskGroup: taskRouter,
  sharedNote: sharedNoteRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
