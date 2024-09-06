import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { todo } = req.body.data;
  try {
    await prisma.todo.create({
      data: {
        todo,
        done: false,
      },
    });
    res.status(200).json({ message: 'Todo Created' });
  } catch (error) {
    console.error(error);
  }
}
