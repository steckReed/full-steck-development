import { MTGCardProps } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export const fetchMTGCard = async (): Promise<MTGCardProps[]> => {
  const response  = await fetch('https://api.scryfall.com/cards/random?q=is%3Acommander');
  const data      = await response.json();
  return data;
};

export const useMTGCard = () => {
  return useQuery<MTGCardProps[]>({
    queryKey  : ['mtgCard'],
    queryFn   : fetchMTGCard,
    staleTime: Infinity,  // Data never becomes stale during the session
  });
};
