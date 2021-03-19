import {
  useQuery,
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseQueryOptions,
  useQueryClient,
} from 'react-query';
import axios, { AxiosError } from 'axios';

const apiBase = '/api';

export function useApiQuery<T = unknown>(
  queryKey: QueryKey,
  path: string,
  options?: UseQueryOptions<T, AxiosError, T>
) {
  return useQuery<T, AxiosError>(
    queryKey,
    () => axios.get(apiBase + path).then((res) => res.data as T),
    options
  );
}

export function useApiPost<T = unknown>(
  path: string,
  options?: UseMutationOptions<T, AxiosError, T>
) {
  return useMutation<T, AxiosError, T>(
    (data) => axios.post(apiBase + path, data).then((res) => res.data as T),
    options
  );
}

interface IdKey {
  id: string;
}

type PartialWithId<T extends IdKey> = Partial<T> & Pick<T, 'id'>;

export function useApiPut<T extends IdKey>(
  path: string,
  options?: UseMutationOptions<T, AxiosError, PartialWithId<T>>
) {
  return useMutation<T, AxiosError, PartialWithId<T>>(async (data) => {
    const { id, ...newData } = data;
    return await axios
      .put(`${apiBase}${path}/${id}`, newData)
      .then((res) => res.data as T);
  }, options);
}

export function useApiDelete<T = unknown>(
  path: string,
  options?: UseMutationOptions<T, AxiosError, string>
) {
  return useMutation<T, AxiosError, string>(
    (id) =>
      axios.delete(`${apiBase}${path}/${id}`).then((res) => res.data as T),
    options
  );
}

// Artist Pages
export function useArtistPages() {
  return useApiQuery<ArtistPage[]>('artistPages', '/artistpages');
}

export function useCreateArtistPage() {
  const queryClient = useQueryClient();
  return useApiPost<Partial<ArtistPage>>('/artistpages', {
    onSuccess: () => {
      queryClient.invalidateQueries('artistPages');
    },
  });
}

export function useReadArtistPage(id: string) {
  return useApiQuery<ArtistPage>(['artistPage', id], `/artistpages/${id}`);
}

export function useUpdateArtistPage() {
  const queryClient = useQueryClient();
  return useApiPut(`/artistpages`, {
    onSuccess: (data: ArtistPage, variables) => {
      queryClient.setQueryData(['artistPages', variables.id], data);
    },
  });
}

export function useDeleteArtistPage() {
  const queryClient = useQueryClient();
  return useApiDelete('/artistpages', {
    onSuccess: () => {
      queryClient.invalidateQueries('artistPages');
    },
  });
}
