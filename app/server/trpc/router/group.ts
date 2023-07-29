import { publicProcedure, router } from "../trpc";
import { CreateGroupSchema } from "../../../common/validation/group";

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
});
