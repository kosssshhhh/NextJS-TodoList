'use client';
import ky from 'ky';
import { useState } from 'react';
import { LeagueEntry } from '@/pages/api/riot/riot';

interface User {
  nickname: string;
  tag: string;
}

export default function Home() {
  const [user, setUser] = useState<User>({
    nickname: '',
    tag: '',
  });

  // Tier 배열로 상태 관리
  const [leagueEntry, setLeagueEntry] = useState<LeagueEntry[]>();

  const onFetch = async (nickname: string, tag: string) => {
    const res = await ky
      .get<LeagueEntry[]>(`/api/riot/riot?nickname=${nickname}&tag=${tag}`)
      .json();

    console.log(res);

    // 두 개의 데이터를 모두 가져와서 상태로 저장
    const fetchLeagueEntry = res.map((item) => ({
      tier: item.tier,
      rank: item.rank,
      leaguePoints: item.leaguePoints,
      wins: item.wins,
      losses: item.losses,
      hotStreak: item.hotStreak,
      queueType: item.queueType,
    }));

    setLeagueEntry(fetchLeagueEntry);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    console.log(user);
  };

  return (
    <main>
      <h1 className='flex text-xl justify-center p-10'>LOL 티어 검색</h1>
      <div className='flex justify-center'>
        <input
          className='m-2 p-2'
          type='text'
          name='nickname'
          placeholder='소환사명을 입력해주세요'
          onChange={onChange}
        />
        <input
          className='m-2 p-2'
          type='text'
          name='tag'
          id='tag'
          placeholder='#Tag 입력해주세요.'
          onChange={onChange}
        />
        <button
          className='p-2'
          onClick={() => onFetch(user.nickname, user.tag)}>
          검색
        </button>
      </div>
      <div className='flex justify-center p-10'>
        {leagueEntry && (
          <div>
            {leagueEntry.map((tier, index) => (
              <div key={index} className='p-4'>
                <div>큐 타입: {tier.queueType}</div>
                <div>티어: {tier.tier}</div>
                <div>랭크: {tier.rank}</div>
                <div>리그 포인트: {tier.leaguePoints}</div>
                <div>승리: {tier.wins}</div>
                <div>패배: {tier.losses}</div>
                <div>연승: {tier.hotStreak ? 'O' : 'X'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
