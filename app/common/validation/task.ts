import { Frequency } from "@prisma/client";
import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  frequency: z.nativeEnum(Frequency),
  isDone: z.boolean(),
  assignedTo: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  taskGroupId: z.string().optional().nullable(),
  createdBy: z.string(),
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
  groupId: z.string(),
  userId: z.string(),
  taskGroupId: z.string(),
  createdBy: z.string(),
});

export const UpdateTaskSchema = CreateTaskSchema.extend({ id: z.string() });

export const TaskGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  tasks: z
    .array(
      z.object({
        TaskSchema,
      })
    )
    .nullable()
    .optional(),
});
export const CreateTaskGroupSchema = z.object({
  name: z.string().min(1, { message: "El nombre no puede estar vacío." }),
  tasks: z
    .array(
      z.object({
        TaskSchema,
      })
    )
    .nullable()
    .optional(),
  groupId: z.string(),
});

export type ITask = z.infer<typeof TaskSchema>;
export type ICreateTask = z.infer<typeof CreateTaskSchema>;
export type IUpdateTask = z.infer<typeof UpdateTaskSchema>;
export type ITaskGroup = z.infer<typeof TaskGroupSchema>;
export type ICreateTaskGroup = z.infer<typeof CreateTaskGroupSchema>;
