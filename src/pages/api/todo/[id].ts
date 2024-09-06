import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const id = req.query.id;
    const todo = await prisma.todo.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(todo);
  } else if (req.method === 'PUT') {
    console.log(req.body.data);
    const { id, todo, done } = req.body.data;
    const todos = await prisma.todo.update({
      where: {
        id: Number(id),
      },
      data: {
        id,
        todo,
        done,
      },
    });
    res.json(todos);
  }
}
