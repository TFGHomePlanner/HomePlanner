import { userRouter } from "./user";
import { router } from "../trpc";

const appRouter = router({
	user: userRouter,
});

export type AppRouter = typeof appRouter;
