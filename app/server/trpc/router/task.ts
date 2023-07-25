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
        userInCharge: {
          select: {
            id: true,
            name: true,
          },
        },
        frequency: true,
        groupTask: true,
        taskGroupId: true,
        taskGroupName: true,
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
