import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const taskRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z
          .string()
          .max(600, {
            message: "La descripción no puede tener más de 600 caracteres",
          })
          .nullable(),
        isPeriodic: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input: { name, description, isPeriodic } }) => {
      return await ctx.prisma.task.create({
        data: {
          name,
          description,
          isPeriodic,
        },
      });
    }),
});
