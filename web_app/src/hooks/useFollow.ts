import { useQueryClient } from 'react-query';
import { useApiPost } from './useApi';

// Follow

interface FollowRequest {
  id: string;
}

export function useAdminFollow(artistPageId: string) {
  const queryClient = useQueryClient();
  return useApiPost<FollowRequest>(
    `/admin/artistpages/${artistPageId}/activitypub/follow`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['adminArtistPage', artistPageId]);
      },
    }
  );
}
