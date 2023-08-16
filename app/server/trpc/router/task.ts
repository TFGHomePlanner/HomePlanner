import { publicProcedure, router } from "../trpc";
import {
  CreateTaskGroupSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
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
          startsAt: true,
          assignedTo: {
            select: {
              id: true,
              name: true,
            },
          },
          taskGroupId: true,
          createdBy: true,
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
        input: {
          name,
          description,
          frequency,
          startsAt,
          groupId,
          userId,
          taskGroupId,
          createdBy,
        },
      }) => {
        return await ctx.prisma.task.create({
          data: {
            name,
            description,
            frequency,
            startsAt,
            groupId,
            userId,
            taskGroupId,
            createdBy,
          },
        });
      }
    ),

  update: publicProcedure
    .input(UpdateTaskSchema)
    .mutation(
      async ({
        ctx,
        input: {
          id,
          name,
          description,
          frequency,
          startsAt,
          groupId,
          userId,
          taskGroupId,
        },
      }) => {
        return await ctx.prisma.task.update({
          where: { id },
          data: {
            name,
            description,
            frequency,
            startsAt,
            groupId,
            userId,
            taskGroupId,
          },
        });
      }
    ),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.task.delete({
        where: { id: input.id },
      });
      return {
        status: 201,
        message: "Task deleted successfully",
      };
    }),

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
          startsAt: true,
          createdBy: true,
          taskGroupId: true,
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
          startsAt: true,
          assignedTo: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: true,
          taskGroupId: true,
        },
        where: {
          groupId: input.groupId,
          taskGroupId: input.taskGroupId,
          isDone: false,
        },
      });
    }),
});
