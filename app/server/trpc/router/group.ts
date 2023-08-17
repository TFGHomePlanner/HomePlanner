import { publicProcedure, router } from "../trpc";
import { CreateGroupSchema } from "../../../common/validation/group";
import { z } from "zod";
import { userSchema } from "../../../common/validation/user";

export const groupRouter = router({
  create: publicProcedure
    .input(CreateGroupSchema)
    .mutation(
      async ({
        ctx,
        input: { name, codeGroup, adminId, description, users },
      }) => {
        const updatedUsers = users
          ? [...users, { id: adminId }]
          : [{ id: adminId }];
        const createdGroup = await ctx.prisma.group.create({
          data: {
            name,
            codeGroup,
            adminId,
            description,
            users: { connect: updatedUsers },
          },
        });
        return {
          groupId: createdGroup.id,
          message: "Grupo creado correctamente.",
        };
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

  getUsers: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(z.array(userSchema))
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.group.findMany({
        select: {
          users: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: { id: input.id },
      });
      const parsedUSers = z.array(userSchema).parse(users[0]?.users || []);
      return parsedUSers;
    }),

  joinGroup: publicProcedure
    .input(z.object({ userId: z.string(), codeGroup: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findUnique({
        where: { codeGroup: input.codeGroup },
        include: { users: true },
      });

      if (!group) {
        return {
          status: 404,
          message: "No se ha encontrado el grupo.",
          groupId: null,
        };
      }

      const userIsInGroup = group.users.some(
        (user) => user.id === input.userId
      );
      if (userIsInGroup) {
        return {
          status: 400,
          message: "El usuario ya está en el grupo.",
          groupId: group.id,
        };
      }

      await ctx.prisma.group.update({
        where: { codeGroup: input.codeGroup },
        data: {
          users: {
            connect: { id: input.userId },
          },
        },
      });

      return {
        status: 200,
        message: "Usuario añadido con éxito.",
        groupId: group.id,
      };
    }),

  exitGroup: publicProcedure
    .input(z.object({ userId: z.string(), groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.group.update({
        where: { id: input.groupId },
        data: {
          users: {
            disconnect: { id: input.userId },
          },
        },
      });
      return {
        status: 200,
        message: "User exit group successfully",
      };
    }),
});
