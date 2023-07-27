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
        where: {
          groupId: input.groupId,
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
});
