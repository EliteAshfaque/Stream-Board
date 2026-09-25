import { useQuery } from '@tanstack/react-query';

import { fetchPublicActivity } from '@/src/services/github';
import { GITHUB_REFETCH_MS } from '@/src/config/limits';

export function usePublicActivity() {
  return useQuery({
    queryKey: ['github', 'public-events'],
    queryFn: ({ signal }) => fetchPublicActivity(signal),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchInterval: GITHUB_REFETCH_MS,
    refetchIntervalInBackground: false,
    retry: 1,
  });
}
