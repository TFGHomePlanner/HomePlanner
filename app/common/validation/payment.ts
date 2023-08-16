
import { z } from "zod";

export const PaymentSchema = 
  z.object({
    payingUser: z.object({
      name: z.string(),
      id: z.string(),
    }),
    createdAt: z.coerce.date(),
    amount: z.number(),
    debtorUsers: z.array(z.object({
      amount: z.number(),
      debtor: z.object({
        name: z.string(),
        id: z.string(),
      }),
    })),
  });

export const SectionPayMentSchema= z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  createdAt: z.coerce.date(),
  payments: z.array(PaymentSchema),
});

export const createPaymentSchema = z.object({ 
  paymentSectionId: z.string(), 
  payingUserId: z.string(), 
  amount: z.number(),
  debtorUsers: z.array(z.object({ 
    debtorId: z.string(), 
    amount: z.number() })) });

  




export type IPayment = z.infer<typeof PaymentSchema>;
export type IreatePayment = z.infer<typeof createPaymentSchema>;
export type IPaymentSection = z.infer<typeof SectionPayMentSchema>;

