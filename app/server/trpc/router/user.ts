import { publicProcedure, router } from "../trpc";
import { signUpSchema } from "../../../common/validation/auth";
import * as trpc from "@trpc/server";
import z from "zod";
import { prisma } from "../../../common/prisma";
import { noteSchema } from "../../../common/validation/note";
import { userProfileSchema } from "../../../common/validation/user";

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

  getUserGroups: publicProcedure
    .input(z.object({ userId: z.string() }).nullish())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.group.findMany({
        select: {
          id: true,
          name: true,
          adminId: true,
          _count: true,
          codeGroup: true,
          description: true,
          users: true,
        },
        where: {
          users: {
            some: {
              id: input?.userId,
            },
          },
        },
      });
    }),

  getUserTasks: publicProcedure
    .input(z.object({ userId: z.string(), groupId: z.string() }).nullish())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.task.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          assignedTo: true,
          frequency: true,
          isDone: true,
          groupTask: true,
        },
        where: {
          userId: input?.userId,
          groupId: input?.groupId,
        },
      });
    }),

  getNotes: publicProcedure
    .input(z.object({ userId: z.string() }))
    .output(z.array(noteSchema))
    .query(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findMany({
        select: {
          id: true,
          title: true,
          text: true,
        },
        where: {
          userId: input.userId,
        },
      });
      const noteParse = z.array(noteSchema).parse(note);
      return noteParse;
    }),

  createNote: publicProcedure
    .input(
      z.object({ userId: z.string(), title: z.string(), text: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.note.create({
        data: {
          title: input.title,
          text: input.text,
          createdAt: new Date(),
          user: { connect: { id: input.userId } },
        },
      });
      return {
        status: 201,
        message: "Note created successfully",
      };
    }),

  updateNote: publicProcedure
    .input(noteSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.note.update({
        where: { id: input.id },
        data: {
          title: input.title,
          text: input.text,
        },
      });
      return {
        status: 200,
        message: "Note updated successfully",
      };
    }),

  deleteNote: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.note.delete({
        where: { id: input.id },
      });
      return {
        status: 200,
        message: "Note deleted successfully",
      };
    }),

  updateUserPassword: publicProcedure
    .input(z.object({ id: z.string(), passwordHash: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          passwordHash: input.passwordHash,
        },
      });
      return {
        status: 200,
        message: "User updated successfully",
      };
    }),

  getUserByID: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(userProfileSchema)
    .query(async ({ ctx, input }) => {
      const userprofile = await ctx.prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          passwordHash: true,
          imageprofile: true,
        },
        where: { id: input.id },
      });
      if (!userprofile) {
        throw new Error("Usuario no encontrado"); // Maneja la ausencia de usuario
      }
      const userParse = userProfileSchema.parse(userprofile);
      return userParse;
    }),
});
