'use client';

import { useRouter } from 'next/navigation'; // 'next/router' 대신 'next/navigation' 사용
import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { MdDone, MdDelete } from 'react-icons/md';

export interface FormData {
  id: number;
  todo: string;
  done: boolean;
}

interface TodoListProps {
  todos: FormData[];
}

export default function TodoList({ todos }: TodoListProps) {
  const router = useRouter();

  const refreshData = () => {
    router.refresh(); // `router.replace(router.asPath)` 대신 `router.refresh()` 사용
  };

  async function toggleDone(todo: FormData) {
    const data = { ...todo, done: !todo.done };
    await axios.put(`/api/todo/${todo.id}`, { data }).then(() => {
      refreshData();
    });
  }

  async function deleteTodo(id: number) {
    await axios.delete(`/api/todo/${id}`).then(() => {
      refreshData();
    });
  }

  return (
    <div className='flex-1 py-5 px-8 overflow-y-auto pb-12 bg-gray-50'>
      <div>
        {todos.map((todo) => (
          <div key={todo.id} className='flex items-center py-3 group'>
            <div
              onClick={() => toggleDone(todo)}
              className={`w-8 h-8 rounded-2xl text-xl flex justify-center items-center mr-5 cursor-pointer border-2 ${
                todo.done ? 'border-[#38d9a9] text-[#38d9a9]' : 'border-[#ced4da] text-[#ced4da]'
              }`}>
              {todo.done && <MdDone />}
            </div>
            <div
              className={`flex-1 text-xl  ${
                todo.done ? 'text-[#ced4da]' : 'text-[#495057]'
              }`}>
              {todo.todo}
            </div>
            <div
              onClick={() => deleteTodo(todo.id)}
              className='items-center justify-center text-[#dee2e6] cursor-pointer text-2xl hover:text-[#ff6b6b] group-hover:block hidden'>
              <MdDelete />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
