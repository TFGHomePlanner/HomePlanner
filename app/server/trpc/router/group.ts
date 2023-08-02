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
});
