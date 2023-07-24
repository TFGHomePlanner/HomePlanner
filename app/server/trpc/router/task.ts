import { publicProcedure, router } from "../trpc";
import { Frequency } from "@prisma/client";
import { z } from "zod";

export const taskRouter = router({
  getAllTasks: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.task.findMany({
      select: {
        id: true,
        _count: true,
        name: true,
        description: true,
        userInCharge: true,
        userId: true,
        frequency: true,
        groupTask: true,
        groupId: true,
        groupName: true,
      },
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z
          .string()
          .max(600, {
            message: "La descripción no puede tener más de 600 caracteres.",
          })
          .nullable(),
        frequency: z.nativeEnum(Frequency),
      })
    )
    .mutation(async ({ ctx, input: { name, description, frequency } }) => {
      return await ctx.prisma.task.create({
        data: {
          name,
          description,
          frequency,
        },
      });
    }),
});
