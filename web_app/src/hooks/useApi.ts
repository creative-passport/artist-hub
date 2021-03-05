import { useQuery, QueryKey, useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';

const apiBase = '/api';

export function useApiQuery<T = unknown>(queryKey: QueryKey, path: string) {
  return useQuery<T, AxiosError>(queryKey, () =>
    axios.get(apiBase + path).then((res) => res.data as T)
  );
}

export function useApiPost<T = unknown>(path: string) {
  return useMutation<T, AxiosError, T>((data) =>
    axios.post(apiBase + path, data).then((res) => res.data as T)
  );
}

export function useApiPut<T = unknown>(path: string) {
  return useMutation<T, AxiosError, Partial<T>>((data) =>
    axios.put(apiBase + path, data).then((res) => res.data as T)
  );
}

export function useApiDelete<T = unknown>(path: string) {
  return useMutation<T, AxiosError, string>((id) =>
    axios.delete(`${apiBase}${path}/${id}`).then((res) => res.data as T)
  );
}

// Artist Pages
export function useArtistPages() {
  return useApiQuery<ArtistPage[]>('artistPages', '/artistpages');
}

export function useCreateArtistPage() {
  return useApiPost<Partial<ArtistPage>>('/artistpages');
}

export function useReadArtistPage(id: string) {
  return useApiQuery<ArtistPage>(['artistPage', id], `/artistpages/${id}`);
}

export function useUpdateArtistPage() {
  return useApiPut('/artistpages');
}

export function useDeleteArtistPage() {
  return useApiDelete('/artistpages');
}
