import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

export const Ping = () => {
  const [ping, setPing] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get('/api/ping')
      .then(({ data }: AxiosResponse) => {
        setPing(data.success);
        setLoading(false);
      })
      .catch(() => {
        setPing(false);
        setLoading(false);
      });
  });
  return (
    <div>{loading ? 'Loading' : ping ? 'Ping success' : 'Ping failed'}</div>
  );
};
