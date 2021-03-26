import { useApiQuery } from './useApi';

// Artist Pages (public view)

export function useArtistPage(id: string) {
  return useApiQuery<ArtistPage>(['artistPage', id], `/artistpages/${id}`);
}
