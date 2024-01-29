import { useState } from "react";

export const useInstagramData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInstagramData = async (username: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/instagram?username=${encodeURIComponent(username)}`);
      if (!response.ok) throw new Error("Erro ao buscar dados do Instagram");
      const json = await response.json();
      setData(json);
      return json;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchInstagramData };
};
