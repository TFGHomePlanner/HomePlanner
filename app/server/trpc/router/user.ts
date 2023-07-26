import { publicProcedure, router } from "../trpc";
import { signUpSchema } from "../../../common/validation/auth";
import * as trpc from "@trpc/server";
import z from "zod";
import { prisma } from "../../../common/prisma";

export const userRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { email, password } = opts.input;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return {
          success: false,
          message: "User not found",
          user: {
            id: "",
            name: "",
            email: "",
          },
        };
      } else if (password === user.passwordHash && email === user.email) {
        return {
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        };
      } else {
        return {
          success: false,
          message: "Invalid credentials",
          user: {
            id: "",
            name: "",
            email: "",
          },
        };
      }
    }),
  createNew: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { username, email, password } = input;

      const exists = await ctx.prisma.user.findFirst({
        where: { email: email },
      });

      if (exists) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const hashedPassword = password;

      const result = await ctx.prisma.user.create({
        data: {
          name: username,
          email,
          passwordHash: hashedPassword,
        },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }),
  getUserTasks: publicProcedure
    .input(z.object({ userId: z.string() }).nullish())
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.userTask.findMany({
        where: { userId: input?.userId },
        select: {
          Task: {
            select: {
              name: true,
              description: true,
              frequency: true,
              createdAt: true,
            },
          },
        },
      });
      return tasks;
    }),
  assignTask: publicProcedure
    .input(z.object({ taskId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input: { taskId, userId } }) => {
      await ctx.prisma.userTask.upsert({
        where: {
          taskId_userId: { taskId, userId },
        },
        create: { taskId, userId },
        update: {},
      });
      return { status: 201 };
    }),
  unassignTask: publicProcedure
    .input(z.object({ taskId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input: { taskId, userId } }) => {
      await ctx.prisma.userTask.delete({
        where: {
          taskId_userId: { taskId, userId },
        },
      });
      return { status: 201 };
    }),
});
