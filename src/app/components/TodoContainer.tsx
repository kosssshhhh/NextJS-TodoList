export default function TodoContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='w-[512px] h-[768px] relative bg-white rounded-lg shadow-lg mx-auto mt-[96px] flex flex-col'>
      {children}
    </div>
  );
}
