import { prisma } from "@/lib/prisma";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function expensesController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const expensesSchema = z.object({
    expenseDescription: z.string(),
    expenseAmount: z.number().nonnegative(),
    paidTo: z.string(),
    expenseDate: z.date().optional(),
    paymentMethod: z.string(),
  });

  const companyidSchema = z.object({
    companyid: z.string(),
  });

  const userid = req.user.sub;

  const { companyid } = companyidSchema.parse(req.params);

  const {
    expenseDescription,
    expenseAmount,
    paidTo,
    expenseDate,
    paymentMethod,
  } = expensesSchema.parse(req.body);

  const expenses = await prisma.expenses.create({
    data: {
      expenseDescription,
      expenseAmount,
      paidTo,
      expenseDate,
      paymentMethod,
      userId: userid,
      companyId: companyid,
    },
  });

  return res.status(201).send(expenses);
}
