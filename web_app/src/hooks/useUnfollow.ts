import { useQueryClient } from 'react-query';
import { useApiDelete } from './useApi';

// Admin Artist Pages

export function useAdminUnfollow(artistPageId: string) {
  const queryClient = useQueryClient();
  return useApiDelete(`/admin/artistpages/${artistPageId}/activitypub/follow`, {
    onSuccess: () => {
      queryClient.invalidateQueries(['adminArtistPage', artistPageId]);
    },
  });
}
