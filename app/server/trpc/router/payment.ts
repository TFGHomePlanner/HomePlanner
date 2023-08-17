import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { SectionPayMentSchema, createPaymentSchema, PaymentSchema} from "../../../common/validation/payment";


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
          isClosed: true,
          participants: {
            select: {
              name: true,
              id: true,
            }
          },
        },
        where: {
          groupId: input.groupId,
        },       
      });
      return z.array(SectionPayMentSchema).parse(paymentSection);
    }),

  getPaymentsSection: publicProcedure
    .input(z.object({ paymentSectionId: z.string() }))
    .output(z.array(PaymentSchema))
    .query(async ({ ctx, input }) => {
      const payments = await ctx.prisma.payment.findMany({
        select: {
          id: true,
          payingUser: {
            select: {
              name: true,
              id: true,
            }    
          },
          
          title: true,
          createdAt: true,
          amount: true,
          debtorUsers: {
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
        },
        where: {
          paymentSectionId: input.paymentSectionId,
        },
      });
      const paymentsparse = z.array(PaymentSchema).parse(payments);
      return paymentsparse;
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
    }),
  paymentsresume: publicProcedure
    .input(z.object({ idPaymentSection: z.string() }))
    .query(async ({ ctx, input }) => {
      const paymentSection = await ctx.prisma.paymentSection.findUnique({
        where: { id: input.idPaymentSection },
        include: {
          participants: true,
          payments: {
            include: {
              payingUser: true,
              debtorUsers: {
                include: {
                  debtor: true,
                },
              },
            },
          },
        },
      });
  
      const saldosUsuarios: Record<string, number> = {};
  
      if (!paymentSection) {
        throw new Error("No existe la seccion de pagos");
      } else {
        paymentSection.participants.forEach((usuario) => {
          saldosUsuarios[usuario.id] = 0;
        });
  
        paymentSection.payments.forEach((pago) => {
          const idPagador = pago.payingUser.id;
          const montoPago = pago.amount;
  
          saldosUsuarios[idPagador] += montoPago;
  
          pago.debtorUsers.forEach((usuarioDeudor) => {
            const idDeudor = usuarioDeudor.debtor.id;
            const montoDeuda = usuarioDeudor.amount;
  
            saldosUsuarios[idDeudor] -= montoDeuda;
          });
        });
  
        const listaSaldos = Object.keys(saldosUsuarios).map((userId) => {
          const usuario = paymentSection.participants.find((u) => u.id === userId);
          const saldo = saldosUsuarios[userId];
          return {
            nombre: usuario?.name, // Reemplaza 'nombre' con la propiedad real del nombre del usuario
            cantidad: saldo,
          };
        });
  
        return listaSaldos;
      }
    }),
  
        
    
});