import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import {
  CreateCalendarSchema,
  CreateEventSchema,
  UpdateEventSchema,
} from "../../../common/validation/event";

export const eventRouter = router({
  getAllEvents: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.event.findMany({
        select: {
          id: true,
          name: true,
          location: true,
          allDay: true,
          calendar: {
            select: {
              id: true,
              name: true,
            },
          },
          startsAt: true,
          endsAt: true,
        },
        where: {
          groupId: input.groupId,
        },
      });
    }),

  create: publicProcedure
    .input(CreateEventSchema)
    .mutation(
      async ({
        ctx,
        input: {
          name,
          location,
          allDay,
          startsAt,
          endsAt,
          calendarId,
          groupId,
          createdBy,
        },
      }) => {
        return await ctx.prisma.event.create({
          data: {
            name,
            location,
            allDay,
            startsAt,
            endsAt,
            calendarId,
            groupId,
            createdBy,
          },
        });
      }
    ),

  update: publicProcedure
    .input(UpdateEventSchema)
    .mutation(
      async ({
        ctx,
        input: {
          id,
          name,
          location,
          allDay,
          startsAt,
          endsAt,
          calendarId,
          groupId,
        },
      }) => {
        return await ctx.prisma.event.update({
          where: { id },
          data: {
            name,
            location,
            allDay,
            startsAt,
            endsAt,
            calendarId,
            groupId,
          },
        });
      }
    ),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.event.delete({
        where: { id: input.id },
      });
      return {
        status: 201,
        message: "Event deleted successfully",
      };
    }),

  getAllCalendars: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.calendar.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          groupId: input.groupId,
        },
      });
    }),
  createCalendar: publicProcedure
    .input(CreateCalendarSchema)
    .mutation(async ({ ctx, input: { name, groupId } }) => {
      return await ctx.prisma.calendar.create({
        data: {
          name,
          groupId,
        },
      });
    }),

  getAllCalendarEvents: publicProcedure
    .input(z.object({ groupId: z.string(), calendarId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.event.findMany({
        select: {
          id: true,
          name: true,
          location: true,
          allDay: true,
          calendar: {
            select: {
              id: true,
              name: true,
            },
          },
          startsAt: true,
          endsAt: true,
        },
        where: {
          groupId: input.groupId,
          calendarId: input.calendarId,
        },
      });
    }),
});
