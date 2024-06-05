import { prisma } from '@/lib/prisma';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function getCompanyController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {

  try{
  const userid = req.user.sub

  const company = await prisma.company.findMany({
    where : {
      userId: userid
    }
})
return res.status(200).send({
  company: company,
})}catch(err){
  return res.status(404).send({
    message: "Company not found",
  });
}
}
