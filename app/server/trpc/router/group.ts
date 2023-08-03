import { publicProcedure, router } from "../trpc";
import { CreateGroupSchema } from "../../../common/validation/group";
import { z } from "zod";

export const groupRouter = router({
  create: publicProcedure
    .input(CreateGroupSchema)
    .mutation(
      async ({
        ctx,
        input: { name, codeGroup, adminId, description, users },
      }) => {
        return await ctx.prisma.group.create({
          data: {
            name,
            codeGroup,
            adminId,
            description,
            users: { connect: users },
          },
        });
      }
    ),

  getAdminId: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.group.findFirst({
        select: {
          adminId: true,
        },
        where: { id: input.id },
      });
    }),


  joinGroup: publicProcedure
    .input(z.object({userId: z.string(), codeGroup: z.string()}))
    .mutation(async ({ctx, input}) => {
      await ctx.prisma.group.update({
        where: {codeGroup: input.codeGroup},
        data: {
          users: {
            connect: {id: input.userId}
          }
        }
      });
      return {
        status: 200,
        message: "User joined group successfully",
      };
    }),

  exitGroup: publicProcedure
    .input(z.object({userId: z.string(), groupId: z.string()}))
    .mutation(async ({ctx, input}) => {
      await ctx.prisma.group.update({
        where: {id: input.groupId},
        data: {
          users: {
            disconnect: {id: input.userId}
          }
        }
      });
      return {
        status: 200,
        message: "User exit group successfully",
      };
    }),
});
