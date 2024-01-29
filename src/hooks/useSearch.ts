import { useState, useEffect } from 'react';

const useSearch = (initialUsername: string) => {
  const [username, setUsername] = useState(initialUsername);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(username);
  const [people, setPeople] = useState([]);
  const [isStartSearch, setIsStartSearch] = useState(false);

  async function handleSearch(searchTerm: string) {
    if (isStartSearch) return;

    setIsStartSearch(true);

    if (searchTerm.length > 1) {
      try {
        const response = await fetch(
          `/api/search-insta-profile?username=${searchTerm}`
        );
        const data = await response.json();
        if (data && data?.length > 0) {
          setPeople(data);
        } else {
          setPeople([]);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        setPeople([]);
      }
    }

    setIsStartSearch(false);
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(username);
    }, 500);

    return () => clearTimeout(timerId);
  }, [username]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return {
    username,
    setUsername,
    people,
    isStartSearch,
    // ... outros valores que você deseja retornar
  };
};

export default useSearch;
