import { useQueryClient } from 'react-query';
import {
  ArtistPage,
  Link,
  UpdateLink,
  UpdateArtistPage,
} from 'types/api-types';
import { useApiQuery, useApiPost, useApiPut, useApiDelete } from './useApi';

// Admin Artist Pages

export function useAdminArtistPages() {
  return useApiQuery<ArtistPage[]>('adminArtistPages', '/admin/artistpages');
}

export function useAdminCreateArtistPage() {
  const queryClient = useQueryClient();
  return useApiPost<Partial<ArtistPage>>('/admin/artistpages', {
    onSuccess: () => {
      queryClient.invalidateQueries('adminArtistPages');
    },
  });
}

export function useAdminReadArtistPage(id: string) {
  return useApiQuery<ArtistPage>(
    ['adminArtistPage', id],
    `/admin/artistpages/${id}`
  );
}

export function useAdminUpdateArtistPage() {
  const queryClient = useQueryClient();
  return useApiPut<ArtistPage, UpdateArtistPage>(
    `/admin/artistpages`,
    {
      onSuccess: (data: ArtistPage, variables) => {
        queryClient.setQueryData(['adminArtistPage', variables.id], data);
      },
    },
    true
  );
}

export function useAdminDeleteArtistPage() {
  const queryClient = useQueryClient();
  return useApiDelete('/admin/artistpages', {
    onSuccess: () => {
      queryClient.invalidateQueries('adminArtistPages');
    },
  });
}

export function useAdminCreateLink(artistPageId: string) {
  const queryClient = useQueryClient();
  return useApiPost<Partial<Link>>(`/admin/artistpages/${artistPageId}/links`, {
    onSuccess: () => {
      queryClient.invalidateQueries(['adminArtistPage', artistPageId]);
    },
  });
}

export function useAdminUpdateLink(artistPageId: string) {
  const queryClient = useQueryClient();
  return useApiPut<UpdateLink>(`/admin/artistpages/${artistPageId}/links`, {
    onSuccess: () => {
      queryClient.invalidateQueries(['adminArtistPage', artistPageId]);
    },
  });
}

export function useAdminDeleteLink(artistPageId: string) {
  const queryClient = useQueryClient();
  return useApiDelete<Link>(`/admin/artistpages/${artistPageId}/links`, {
    onSuccess: () => {
      queryClient.invalidateQueries(['adminArtistPage', artistPageId]);
    },
  });
}
