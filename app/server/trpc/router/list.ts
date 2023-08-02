import { publicProcedure, router } from "../trpc";
import { listSchema } from "../../../common/validation/list";
import z from "zod";
import { listsSchemaCreate, favouritesProductsSchema} from "../../../common/validation/list";

export const listrouter = router({
  getAllLists: publicProcedure
    .input(z.object({ groupId: z.string(), isClosed: z.boolean() }))
    .output(z.array(listSchema))
    .query(async ({ input, ctx }) => {
      const lists = await ctx.prisma.list.findMany({
        select: {
          name: true,
          description: true,
          isClosed: true,
          id: true,
          creatorId: true,
          isPublic: true,
          items: {
            select: {
              isPurchased: true,
              name: true,
              id: true,   
            },
          },
        },
        where: {
          groupId: input.groupId,
          isClosed: input.isClosed,
        }
      });
      const messageParse = z.array(listSchema).parse(lists);
      return messageParse;
    }),
  createList: publicProcedure
    .input(listsSchemaCreate)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.list.create({
        data: {
          name: input.name,
          description: input.description,
          isClosed: false,
          creatorId: input.creatorId,
          isPublic: input.isPublic,
          group: { connect: { id: input.groupId } },
          items: {
            createMany: {
              data: input.items.map((item) => ({
                name: item,
                isPurchased: false,
              
              })),
            },
          },
        
        },
      });
      return {
        status: 201,
        message: "Mensaje Creado correctamente",
      };
    }),

  getAllFavouritesProducts: publicProcedure
    .input(z.object({ groupId: z.string()}))
    .query(async ({input, ctx}) => {
      return await ctx.prisma.favouritesProducts.findMany({
        select: {
          name: true,
        },
        where : {
          groupId: input.groupId,
        }
      });      
    }),

  getListById: publicProcedure
    .input(z.object({ groupId: z.string(), listId: z.string() }))
    .output(z.array(listSchema))
    .query(async ({ input, ctx }) => {
      const lists = await ctx.prisma.list.findMany({
        select: {
          name: true,
          description: true,
          isClosed: true,
          id: true,
          creatorId: true,
          isPublic: true,
          items: {
            select: {
              isPurchased: true,
              name: true,
              id: true,   
            },
          },
        },
        where: {
          groupId: input.groupId,
          id: input.listId,
        }
      });
      const messageParse = z.array(listSchema).parse(lists);
      return messageParse;
    }),
  updateProduct: publicProcedure
    .input(z.object({id: z.string(), isPurchased: z.boolean()}))
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedProduct = await ctx.prisma.product.update({
          where: { id: input.id },
          data: { isPurchased: input.isPurchased },
        });
        if(input.isPurchased) {
          return {
            success: "added",
            message: "Correct Update",
            product: updatedProduct,
          };
        }
        else {
          return {
            success: "deleted",
            message: "Correct Update",
            product: updatedProduct,
          };
        }
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        throw new Error("No se pudo actualizar el producto.");
      }
    }),

  deletelist: publicProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input, ctx}) => {
      try {
        const deletedList = await ctx.prisma.$transaction(async (tx) => {
          await tx.product.deleteMany({
            where: { listId: input.id },
          });
          const deletedList = await tx.list.delete({
            where: { id: input.id },
          });
          return deletedList;
        });
  
        return {
          success: "deleted",
          message: "Correct Delete",
        };
      } catch (error) {
        console.error("Error al eliminar la lista:", error);
        throw new Error("No se pudo eliminar la lista.");
      }
    }),
  closeList: publicProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input, ctx}) => { 
      try {
        const closedList = await ctx.prisma.list.update({
          where: { id: input.id },
          data: { isClosed: true },
        });
        return {
          success: "closed",
          message: "Correct Update",
          list: closedList,
        };
      } catch (error) {
        console.error("Error al cerrar la lista:", error);
        throw new Error("No se pudo cerrar la lista.");
      }
    })
});