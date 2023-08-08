import { publicProcedure, router } from "../trpc";
import {
  CreateTaskGroupSchema,
  CreateTaskSchema,
} from "../../../common/validation/task";
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
      async ({
        ctx,
        input: { name, description, frequency, groupId, userId, taskGroupId },
      }) => {
        return await ctx.prisma.task.create({
          data: {
            name,
            description,
            frequency,
            groupId,
            userId,
            taskGroupId,
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

  getUnassignedTasks: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.task.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          frequency: true,
          isDone: true,
          assignedTo: true,
          createdAt: true,
        },
        where: {
          groupId: input.groupId,
          isDone: false,
          userId: null,
        },
      });
    }),

  getAllTaskGroups: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.taskGroup.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          groupId: input.groupId,
        },
      });
    }),
  createTaskGroup: publicProcedure
    .input(CreateTaskGroupSchema)
    .mutation(async ({ ctx, input: { name, groupId } }) => {
      return await ctx.prisma.taskGroup.create({
        data: {
          name,
          groupId,
        },
      });
    }),

  getAllGroupTasks: publicProcedure
    .input(z.object({ groupId: z.string(), taskGroupId: z.string() }))
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
        },
        where: {
          groupId: input.groupId,
          taskGroupId: input.taskGroupId,
          isDone: false,
        },
      });
    }),
});
