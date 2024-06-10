import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function deleteExpensesController(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const deleteExpensesSchema = z.object({
      expenseid: z.string(),
    });

    const { expenseid } = deleteExpensesSchema.parse(req.params);

    const deletedExpenses = await prisma.expenses.delete({
      where: {
        id: expenseid,
      },
    });
    if (!deletedExpenses) {
      return res.status(404).send({
        message: "Expense not found",
      });
    }

    return res.status(200).send({
      message: "Expenses deleted succesfully",
      expenses: deletedExpenses,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
}
