import { useState, useEffect } from 'react';

export const useFetch = (url: string) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      setLoading(false);
      setData(data);
    };

    getData();
  }, [url]);

  return { loading, data };
};
