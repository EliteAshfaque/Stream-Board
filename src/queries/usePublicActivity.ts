import { useQuery } from '@tanstack/react-query';

import { fetchPublicActivity } from '@/src/api/githubPublicEvents';

export function usePublicActivity() {
  return useQuery({
    queryKey: ['github', 'public-events'],
    queryFn: ({ signal }) => fetchPublicActivity(signal),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchInterval: 120_000,
    refetchIntervalInBackground: false,
    retry: 1,
  });
}
