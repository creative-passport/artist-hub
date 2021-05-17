import { ArtistPage } from 'types/api-types';
import { useApiQuery } from './useApi';

// Artist Pages (public view)

export function useArtistPage(id: string) {
  return useApiQuery<ArtistPage>(['artistPage', id], `/artistpages/${id}`);
}
