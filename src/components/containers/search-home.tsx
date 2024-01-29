import Image from "next/image";
import { InputSearch } from "../input-search";

interface SearchHomeProps {
    username: string;
    setUsername: (value: string) => void;
    people: any[];
    isStartSearch: boolean;
    loadingStep: number;
    disableButton?: boolean;
    setTemporaryUserData: (value: any) => void;
    verifyUserFromSheet: (username: string) => void;
}


export function SearchHome({
    username,
    setUsername,
    people,
    isStartSearch,
    loadingStep,
    disableButton,
    setTemporaryUserData,
    verifyUserFromSheet,
}: SearchHomeProps) {
  return (
    <div className="flex flex-col h-full min-h-screen w-full max-w-[380px] items-start justify-start lg:justify-center gap-10 p-2 pt-8 pb-32">
      <Image
        src="/img/ray.png"
        alt="Raio"
        width={100}
        height={100}
        className="self-center"
      />
      <h1 className="w-full max-w-96 text-5xl font-normal text-center">
        Crie seu site assistente em até
        <br />
        <strong className="text-[#f07026] font-normal"> 15 segundos!</strong>
      </h1>
      <p className="w-full max-w-96 text-lg font-light text-center mb-4">
        Site profissional com assistente
        <br />
        de inteligência artificial integrada
      </p>

      <div className="flex flex-col items-center justify-center gap-2 bg-white w-full p-8 rounded-2xl shadow-xl">
        <label
          htmlFor="username"
          className="w-full max-w-96 text-base text-gray-700 font-normal text-start"
        >
          Busque seu Instagram:
        </label>

        <InputSearch
          value={username}
          onChange={setUsername}
          people={people}
          isStartSearch={isStartSearch}
          onSelectedPerson={(person) => {
            setTemporaryUserData({
              full_name: person.user.full_name,
              profile_pic_url: person.user.profile_pic_url,
            });
          }}
        />
        <button
          type="button"
          onClick={() => verifyUserFromSheet(username)}
          className={`w-full max-w-[340px] flex items-center justify-center bg-[#F9673A] text-white px-4 py-3 mt-4 gap-2 rounded-full hover:brightness-75 transition duration-150 ${
            (!username || loadingStep > 0 || disableButton) && "opacity-50 cursor-not-allowed"
          }`}
          disabled={!username || loadingStep > 0 || disableButton}
        >
          <img src="/img/wand.svg" alt="Varinha" />
          Criar meu site com IA
        </button>
      </div>
    </div>
  );
}
