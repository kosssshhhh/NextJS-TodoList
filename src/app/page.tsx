import { prisma } from '@/lib/prisma';
import TodoList from '@/app/components/TodoList';
import TodoContainer from '@/app/components/TodoContainer';
import TodoHeader from '@/app/components/TodoHeader';
import TodoCreate from '@/app/components/TodoCreate';

export default async function Home() {
  // 서버 컴포넌트에서 데이터 fetching
  try {
    const todos = await prisma.todo.findMany({
      select: {
        id: true,
        todo: true,
        done: true,
      },
    });

    todos.sort((a, b) => (a.id < b.id ? -1 : 1));

    return (
      <div>
        <TodoContainer>
          <TodoHeader remainTask={todos.filter((todo) => !todo.done).length} />
          <TodoList todos={todos} />
          <TodoCreate />
        </TodoContainer>
      </div>
    );
  } catch (error) {
    console.error('Error fetching todos:', error);
    return <div>Failed to load todos. Please try again later.</div>;
  }
}
