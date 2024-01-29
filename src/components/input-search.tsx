import React, { useEffect, useRef, useState } from "react";

interface Person {
  user: {
    username: string;
    full_name: string;
    profile_pic_url: string;
    is_verified: boolean;
  };
}

interface InputSearchProps {
  value: string;
  onChange: (username: string) => void;
  people: Person[];
  isStartSearch?: boolean;
  onSelectedPerson?: (person: Person) => void;
}

export function InputSearch({
  value,
  onChange,
  people,
  isStartSearch,
  onSelectedPerson,
}: InputSearchProps) {
  const [isListVisible, setIsListVisible] = useState(false);
  const [userSelectedFromList, setUserSelectedFromList] = useState<string | null>(null);
  const listRef = useRef(null);

  useEffect(() => {
    if(userSelectedFromList == value){
      setIsListVisible(false);
    }
    else if (people?.length > 0) {
      setIsListVisible(true);
    }
  }, [userSelectedFromList, value, people]);

  const handleSelectPerson = (personName: string) => {
    if(personName != value){
      onChange(personName);
    };
  };

  const handleBlur = () => {
    if (isListVisible) setIsListVisible(false);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (listRef.current && (listRef.current as any).contains(event.target)) {
      event.preventDefault();
    }
  };

  const VerifiedIcon = () => (
    <svg aria-label="Verified" className="ml-1" fill="rgb(0, 149, 246)" height="12" role="img" viewBox="0 0 40 40" width="12">
      <title>Verified</title>
      <path d="M19.998 3.094 L14.638 0 l-2.972 5.15 H5.432 v6.354 L0 14.64 3.094 20 0 25.359 l5.432 3.137 v5.905 h5.975 L14.638 40 l5.36-3.094 L25.358 40 l3.232-5.6 h6.162 v-6.01 L40 25.359 36.905 20 40 14.641 l-5.248-3.03 v-6.46 h-6.419 L25.358 0 l-5.36 3.094 Z m7.415 11.225 l2.254 2.287 -11.43 11.5 -6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18 Z" fillRule="evenodd"></path>
    </svg>
  );  

  return (
    <div className="w-full max-w-[340px]">
      <input
        type="text"
        placeholder="Ex.: app.assis"
        className="w-full max-w-[340px] border border-gray-300 rounded-xl px-4 py-3 text-base"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onBlur={handleBlur}
      />
      {value.length > 0 && isListVisible && (
        <div
          className="absolute z-10 w-full max-w-[340px] h-full max-h-52 bg-white border border-gray-300 rounded-md mt-1 overflow-y-auto"
          onMouseDown={handleMouseDown}
          ref={listRef}
        >
          {isStartSearch ? (
            <div className="text-center py-2">Carregando...</div>
          ) : people?.length === 0 ? (
            <div className="text-center py-2">Usuário não encontrado.</div>
          ) : (
            people?.slice(0, 20)?.map((person, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                    handleSelectPerson(person.user.username);
                    setUserSelectedFromList(person.user.username);
                    if (onSelectedPerson) onSelectedPerson(person);
                }}
              >
                <img
                  src={`/api/image-proxy/${encodeURIComponent(person.user.profile_pic_url)}`}
                  onError={(e) => {
                    e.currentTarget.src = "/img/user.png";
                  }}
                  alt={person.user.username}
                  className="w-10 h-10 rounded-full bg-gray-300"
                  crossOrigin="anonymous"
                />
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <p className="font-medium">{person.user.username}</p>
                    {person.user.is_verified && <VerifiedIcon />}
                  </div>
                  <p className="font-normal text-gray-500 text-xs">
                    {person.user.full_name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
