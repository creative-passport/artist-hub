import {
  useQuery,
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseQueryOptions,
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

export function useApiPut<T extends IdKey, U extends IdKey = PartialWithId<T>>(
  path: string,
  options?: UseMutationOptions<T, AxiosError, U>,
  encodeFormData = false
) {
  return useMutation<T, AxiosError, U>(async (data) => {
    let newData: Record<string, unknown> | FormData | undefined;
    if (encodeFormData) {
      let formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      newData = formData;
    } else {
      const { id: _id, ...rest } = data;
      newData = rest;
    }
    return await axios
      .put(`${apiBase}${path}/${data.id}`, newData)
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
