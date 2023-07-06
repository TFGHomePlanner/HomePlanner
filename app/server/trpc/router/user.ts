import { publicProcedure, router } from "../trpc";
import { loginSchema, signUpSchema } from "../../../common/validation/auth";
import * as trpc from "@trpc/server";

export const userRouter = router({

  login: publicProcedure
    .input(loginSchema)
    .query(async ({ ctx, input }) => {
      const {
        email, 
        password
      } = input;
      return await ctx.prisma.user.findFirst({
        where: {
          email : email,
          passwordHash :password
        }
      });
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
});
