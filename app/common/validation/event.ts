import { z } from "zod";

export const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  isEvent: z.boolean(),
  location: z.string().nullable(),
  allDay: z.boolean(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional().nullable(),
  calendar: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional()
    .nullable(),
  notes: z.string().nullable(),
  createdBy: z.string(),
});

export const CreateEventSchema = z.object({
  name: z.string(),
  isEvent: z.boolean(),
  location: z
    .string()
    .max(20, {
      message: "Máximo 20 caracteres.",
    })
    .nullable(),
  allDay: z.boolean(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional().nullable(),
  calendarId: z
    .string()
    .max(200, { message: "Máximo 200 caracteres." })
    .optional()
    .nullable(),
  notes: z.string().optional().nullable(),
  groupId: z.string(),
  createdBy: z.string(),
});

export const UpdateEventSchema = CreateEventSchema.extend({ id: z.string() });

export const CalendarSchema = z.object({
  id: z.string(),
  name: z.string(),
  events: z
    .array(
      z.object({
        EventSchema: EventSchema,
      })
    )
    .nullable()
    .optional(),
});
export const CreateCalendarSchema = z.object({
  name: z.string().min(1, { message: "El nombre no puede estar vacío." }),
  groupId: z.string(),
});

export type IEvent = z.infer<typeof EventSchema>;
export type ICreateEvent = z.infer<typeof CreateEventSchema>;
export type IUpdateEvent = z.infer<typeof UpdateEventSchema>;
export type ICalendar = z.infer<typeof CalendarSchema>;
export type ICreateCalendar = z.infer<typeof CreateCalendarSchema>;
