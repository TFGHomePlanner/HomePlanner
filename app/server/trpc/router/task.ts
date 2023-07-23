import { publicProcedure, router } from "../trpc";
import { TaskFrequency } from "@prisma/client";
import { z } from "zod";

export const taskRouter = router({
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
        frequency: z.nativeEnum(TaskFrequency),
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
