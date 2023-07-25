import { Frequency } from "@prisma/client";
import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  userInCharge: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional()
    .nullable(),
  groupId: z.string().optional().nullable(),
  frequency: z.nativeEnum(Frequency),
});

export const CreateTaskSchema = z.object({
  name: z.string(),
  description: z
    .string()
    .max(600, {
      message: "La descripción no puede tener más de 600 caracteres.",
    })
    .nullable(),
  frequency: z.nativeEnum(Frequency),
});

export type ITask = z.infer<typeof TaskSchema>;
export type ICreateTask = z.infer<typeof CreateTaskSchema>;
