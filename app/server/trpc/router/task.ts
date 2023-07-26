import { publicProcedure, router } from "../trpc";
import { CreateTaskSchema } from "../../../common/validation/task";

export const taskRouter = router({
  getAllTasks: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.task.findMany({
      select: {
        id: true,
        _count: true,
        name: true,
        description: true,
        userTask: {
          select: {
            User: {
              select: { name: true },
            },
          },
        },
        frequency: true,
        isDone: true,
        createdAt: true,
        groupTask: true,
      },
    });
  }),
  create: publicProcedure
    .input(CreateTaskSchema)
    .mutation(async ({ ctx, input: { name, description, frequency } }) => {
      return await ctx.prisma.task.create({
        data: {
          name,
          description,
          frequency,
        },
      });
    }),
});
