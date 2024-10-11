import type { NextApiRequest, NextApiResponse } from 'next';
import ky from 'ky';

interface RiotApiResponseType {
  puuid: string;
  gameName: string;
  tagLine: string;
}

interface SummonerApiResponseType {
  accountId: string;
  profileIconId: number;
  revisionDate: number;
  id: string;
  puuid: string;
  summonerLevel: number;
}

export interface LeagueEntry {
  queueType: string; // 'RANKED_FLEX_SR' or 'RANKED_SOLO_5x5' 같은 큐 타입을 나타냄
  tier: string; // 티어 (예: "GOLD", "DIAMOND" 등)
  rank: string; // 랭크 (예: "III", "IV" 등)
  leaguePoints: number; // 리그 포인트
  wins: number; // 승리 횟수
  losses: number; // 패배 횟수
  hotStreak: boolean; // 연승 여부
}

type LeagueEntries = LeagueEntry[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { nickname, tag } = req.query;
  const puuid = await fetchPuuid(nickname as string, tag as string);
  const sommonerId = await fetchSummonerId(puuid);
  const tier = await fetchTier(sommonerId);

  return res.status(200).json(tier);
}

const fetchSummonerId = async (puuid: string): Promise<string> => {
  const res = await ky
    .get<SummonerApiResponseType>(
      `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      }
    )
    .json();
  console.log(res);

  return res.id;
};

const fetchPuuid = async (nickname: string, tag: string): Promise<string> => {
  try {
    console.log('API_KEY: ', process.env.RIOT_API_KEY);
    console.log('nickname:', nickname);
    console.log('tag:', tag);

    const res = await ky
      .get<RiotApiResponseType>(
        `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${nickname}/${tag}?api_key=${process.env.RIOT_API_KEY}`,
        {
          retry: {
            limit: 0, // 기본 재시도 로직을 ky에서 사용하지 않음 (우리가 직접 구현)
          },
        }
      )
      .json();

    console.log(res);
    return res.puuid;
  } catch (error: any) {
    if (error.response && error.response.status === 403) {
      // Rate Limit 초과 시 'Retry-After' 헤더 확인
      const retryAfter = error.response.headers.get('Retry-After');
      if (retryAfter) {
        const retryAfterSeconds = parseInt(retryAfter, 10);
        console.log(
          `Rate limit exceeded. Retrying after ${retryAfterSeconds} seconds...`
        );

        // 'Retry-After' 헤더에 지정된 시간만큼 대기
        await new Promise((resolve) =>
          setTimeout(resolve, retryAfterSeconds * 1000)
        );

        // 대기 후 다시 fetchPuuid 함수 호출
        return fetchPuuid(nickname, tag);
      }
    }
    // 에러가 403이 아니거나, 'Retry-After' 헤더가 없는 경우 에러를 그대로 던짐
    throw error;
  }
};

const fetchTier = async (puuid: string): Promise<LeagueEntries> => {
  const res = await ky
    .get<LeagueEntries>(
      `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${puuid}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      }
    )
    .json();
  console.log(res);
  return res;
};
