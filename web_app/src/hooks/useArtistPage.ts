import { ArtistPage, FeedItem } from 'types/api-types';
import { useApiQuery, apiBase } from './useApi';
import { useInfiniteQuery } from 'react-query';
import axios, { AxiosError } from 'axios';

// Artist Pages (public view)

export function useArtistPage(id: string) {
  return useApiQuery<ArtistPage>(['artistPage', id], `/artistpages/${id}`);
}

interface FeedResult {
  data: FeedItem[];
  nextCursor: string;
}

export function useArtistPageFeed(id: string) {
  return useInfiniteQuery<FeedResult, AxiosError>(
    ['artistPageFeed', id],
    async ({ pageParam }) => {
      let url = apiBase + `/artistpages/${id}/feed`;
      if (pageParam) {
        url = url + `?cursor=${pageParam}`;
      }
      return await axios.get(url).then((res) => res.data as FeedResult);
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    }
  );
}
