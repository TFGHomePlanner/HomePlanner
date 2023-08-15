import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { CreatedSharedNoteSchema } from "../../../common/validation/sharedNote";

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
      });
    }),
  createNote: publicProcedure
    .input(CreatedSharedNoteSchema)
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
});
