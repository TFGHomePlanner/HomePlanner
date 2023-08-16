import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { SectionPayMentSchema, createPaymentSchema } from "../../../common/validation/payment";


export const paymentRouter = router({
  getAllPaymentsSections: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .output(z.array(SectionPayMentSchema))
    .query(async ({ ctx, input }) => {
      const paymentSection =  await ctx.prisma.paymentSection.findMany({
        select : {
          id: true,
          title: true,
          description: true,
          totalAmount: true, 
          createdAt: true,    
          payments: {
            select: {
              payingUser: {
                select: {
                  name: true,
                  id: true,
                }
              },
              createdAt: true,
              amount: true,
              debtorUsers:
                    {
                      select: {
                        amount: true,
                        debtor: {
                          select: {
                            name: true,
                            id: true,
                          }
                        }
                      }  
                    }
            }
          }
        },
        where: {
          groupId: input.groupId,
        },       
      });
      return z.array(SectionPayMentSchema).parse(paymentSection);
    }),
  createPaymentSection: publicProcedure
    .input(z.object({ groupId: z.string(), title: z.string(), description: z.string()}))
    .mutation(async ({ ctx, input }) => {
      const paymentSection = await ctx.prisma.paymentSection.create({
        data: {
          title: input.title,
          description: input.description,
          groupId: input.groupId,
          totalAmount: 0.0,
        },
      });
      return paymentSection;
    }),
  createPayment: publicProcedure
    .input(createPaymentSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.payment.create({
        data: {
          paymentSectionId: input.paymentSectionId,
          payingUserId: input.payingUserId,
          amount: input.amount,
          debtorUsers: {
            create: input.debtorUsers.map((debtorUser) => ({
              amount: debtorUser.amount,
              debtorId: debtorUser.debtorId,
            })),
          },
        },  
      });
    })

});