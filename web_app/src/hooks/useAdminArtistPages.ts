import { useQueryClient } from 'react-query';
import { useApiQuery, useApiPost, useApiPut, useApiDelete } from './useApi';
// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

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
  return useApiPut(`/admin/artistpages`, {
    onSuccess: (data: ArtistPage, variables) => {
      queryClient.setQueryData(['adminArtistPage', variables.id], data);
    },
  });
}

export function useAdminDeleteArtistPage() {
  const queryClient = useQueryClient();
  return useApiDelete('/admin/artistpages', {
    onSuccess: () => {
      queryClient.invalidateQueries('adminArtistPages');
    },
  });
}
