import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { CreateSharedNoteSchema } from "../../../common/validation/sharedNote";

export const sharedNoteRouter = router({
  getAllNotes: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.sharedNote.findMany({
        select: {
          id: true,
          title: true,
          text: true,
          createdAt: true,
          userId: true,
          groupId: true,
        },
        where: { groupId: input.groupId },
        orderBy: { createdAt: "desc" },
      });
    }),
  createNote: publicProcedure
    .input(CreateSharedNoteSchema)
    .mutation(async ({ ctx, input: { title, text, userId, groupId } }) => {
      await ctx.prisma.sharedNote.create({
        data: {
          title: title,
          text: text,
          userId: userId,
          groupId: groupId,
        },
      });
      return {
        status: 201,
        message: "Note created successfully",
      };
    }),
  deleteNote: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.sharedNote.delete({
        where: { id: input.id },
      });
      return {
        status: 201,
        message: "Note deleted successfully",
      };
    }),
});
