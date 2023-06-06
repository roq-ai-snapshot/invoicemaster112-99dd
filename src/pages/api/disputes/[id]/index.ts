import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { disputeValidationSchema } from 'validationSchema/disputes';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.dispute
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDisputeById();
    case 'PUT':
      return updateDisputeById();
    case 'DELETE':
      return deleteDisputeById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDisputeById() {
    const data = await prisma.dispute.findFirst(convertQueryToPrismaUtil(req.query, 'dispute'));
    return res.status(200).json(data);
  }

  async function updateDisputeById() {
    await disputeValidationSchema.validate(req.body);
    const data = await prisma.dispute.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteDisputeById() {
    const data = await prisma.dispute.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
