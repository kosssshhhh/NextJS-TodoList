'use client';

import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';
import { MdAdd } from 'react-icons/md';
import axios from 'axios';

export interface FormData {
  id: number;
  todo: string;
  done: boolean;
}

export default function TodoCreate() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>({
    id: 0,
    todo: '',
    done: false,
  });
  const refreshData = () => {
    setForm({ todo: '', done: false, id: 0 });
    router.refresh(); // `router.replace(router.asPath)` 대신 `router.refresh()` 사용
  };
  const onChange = <T extends HTMLInputElement | HTMLTextAreaElement>(
    e: ChangeEvent<T>
  ): void => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  async function createTodo(data: FormData) {
    if (data.id) {
      await axios.put(`/api/todo/${data.id}`, { data }).then(() => {
        refreshData();
      });
      return;
    }
    await axios.post(`/api/todo/create`, { data }).then(() => {
      refreshData();
    });
  }
  return (
    <div className='w-full absolute bottom-0 left-0'>
      {open && (
        <form
          className='bg-[#f8f9fa] p-8 pb-20 rounded-b-lg border-t-[1px] border-[#e9ecef]'
          onSubmit={(e) => {
            e.preventDefault();
            createTodo(form);
          }}>
          <input
            className='p-3 rounded-[4px] border-[1px] border-[#dee2e6] w-full outline-none text-[18px] box-border'
            type='text'
            placeholder='할 일을 입력 후, Enter를 누르세요'
            name='todo'
            value={form.todo}
            onChange={onChange}
          />
        </form>
      )}
      <button
        className={`${
          open
            ? 'bg-[#ff6b6b] hover:bg-[#ff8787] active:bg-[#fa5252]'
            : 'bg-[#38d9a9] hover:bg-[#63e6be] active:bg-[#20c997]'
        } z-10 cursor-pointer w-[80px] h-[80px] flex items-center justify-center text-6xl absolute left-1/2 bottom-0 transform translate-x-[-50%] translate-y-[50%] rounded-full text-white transition-all duration-125 ease-in ${
          open ? 'rotate-45' : ''
        }`}
        type='button'
        onClick={() => setOpen(!open)}>
        <MdAdd />
      </button>
    </div>
  );
}
