interface TodoHeaderProps {
  remainTask: number;
}

export default function TodoHeader({ remainTask }: TodoHeaderProps) {
  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dayName = today.toLocaleDateString('ko-KR', { weekday: 'long' });

  return (
    <div className='pt-12 px-8 pb-6 border-b-[1px]'>
      <h1 className='m-0 text-3xl text-[#343a40]'>{dateString}</h1>
      <div className='mt-1 text-[#868e96] text-base'>{dayName}</div>
      <div className='text-[#20c997] mt-[40px] text-lg'>
        {remainTask ? `할 일 ${remainTask}개 남음` : '모든 할 일을 완료했어요!'}
      </div>
    </div>
  );
}
