import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import {
  CreateCalendarSchema,
  CreateEventSchema,
  CreateReservationSchema,
  UpdateEventSchema,
  UpdateReservationSchema,
} from "../../../common/validation/event";

export const eventRouter = router({
  getAllEvents: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.event.findMany({
        select: {
          id: true,
          name: true,
          isEvent: true,
          location: true,
          allDay: true,
          startsAt: true,
          endsAt: true,
          calendar: {
            select: {
              id: true,
              name: true,
            },
          },
          notes: true,
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
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
          isEvent,
          location,
          allDay,
          startsAt,
          endsAt,
          calendarId,
          notes,
          groupId,
          userId,
        },
      }) => {
        const eventData = {
          name,
          isEvent,
          location,
          allDay,
          startsAt,
          endsAt,
          calendarId,
          notes,
          groupId,
          userId,
        };
        isEvent && (eventData.endsAt = endsAt);
        return await ctx.prisma.event.create({ data: eventData });
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
          notes,
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
            notes,
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
        message: "Evento eliminado correctamente.",
      };
    }),

  getAllReservations: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.reservation.findMany({
        select: {
          id: true,
          room: true,
          description: true,
          allDay: true,
          startsAt: true,
          endsAt: true,
          notes: true,
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          groupId: true,
        },
        where: {
          groupId: input.groupId,
        },
      });
    }),
  createReservation: publicProcedure
    .input(CreateReservationSchema)
    .mutation(
      async ({
        ctx,
        input: {
          room,
          description,
          allDay,
          startsAt,
          endsAt,
          notes,
          groupId,
          userId,
        },
      }) => {
        return await ctx.prisma.reservation.create({
          data: {
            room,
            description,
            allDay,
            startsAt,
            endsAt,
            notes,
            groupId,
            userId,
          },
        });
      }
    ),
  updateReservation: publicProcedure
    .input(UpdateReservationSchema)
    .mutation(
      async ({
        ctx,
        input: { id, room, description, allDay, startsAt, endsAt, notes },
      }) => {
        return await ctx.prisma.reservation.update({
          where: { id },
          data: {
            room,
            description,
            allDay,
            startsAt,
            endsAt,
            notes,
          },
        });
      }
    ),
  deleteReservation: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.reservation.delete({
        where: { id: input.id },
      });
      return {
        status: 201,
        message: "Reserva eliminada correctamente.",
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
          isEvent: true,
          location: true,
          allDay: true,
          startsAt: true,
          endsAt: true,
          calendar: {
            select: {
              id: true,
              name: true,
            },
          },
          notes: true,
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          groupId: input.groupId,
          calendarId: input.calendarId,
        },
      });
    }),
});
