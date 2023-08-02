import { publicProcedure, router } from "../trpc";
import { CreateTaskSchema } from "../../../common/validation/task";
import { z } from "zod";

export const taskRouter = router({
  getAllTasks: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.task.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          frequency: true,
          isDone: true,
          createdAt: true,
          assignedTo: {
            select: {
              id: true,
              name: true,
            },
          },
          groupTask: true,
        },
        where: {
          groupId: input.groupId,
          isDone: false,
        },
      });
    }),

  create: publicProcedure
    .input(CreateTaskSchema)
    .mutation(
      async ({ ctx, input: { name, description, frequency, groupId } }) => {
        return await ctx.prisma.task.create({
          data: {
            name,
            description,
            frequency,
            groupId,
          },
        });
      }
    ),

  checkTask: publicProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input: { taskId } }) => {
      return await ctx.prisma.task.update({
        where: { id: taskId },
        data: {
          isDone: true,
        },
      });
    }),
});
