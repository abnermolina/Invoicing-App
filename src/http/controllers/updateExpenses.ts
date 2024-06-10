import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

export async function updateExpensesController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const updateExpensesSchema = z.object({
    expenseDescription: z.string().optional(),
    expenseAmount: z.number().optional(),
    paidTo: z.string().optional(),
    expenseDate: z.date().optional(),
    paymentMethod: z.string().optional(),
  });

  const expenseIdSchema = z.object({
    expenseid: z.string(),
  });

  const userid = req.user.sub;

  try {
    const {
      expenseDescription,
      expenseAmount,
      paidTo,
      expenseDate,
      paymentMethod,
    } = updateExpensesSchema.parse(req.body);

    const { expenseid } = expenseIdSchema.parse(req.params);

    const updateExpenses = await prisma.expenses.update({
      where: {
        id: expenseid,
        userId: userid,
      },
      data: {
        expenseDescription,
        expenseAmount,
        paidTo,
        expenseDate,
        paymentMethod,
      },
    });

    if (!updateExpenses) {
      return res.status(404).send({ message: "Expenses not found" });
    }

    return res.status(200).send({
      message: "Expenses information updated succesfully",
      expenses: updateExpenses,
    });
  } catch {
    return res.status(500).send({ message: "Something went wrong" });
  }
}
