import { FaInstagram } from "react-icons/fa";
import { FiGlobe } from "react-icons/fi";

interface ProfileProps {
    name: string;
    description: string;
    avatarUrl: string;
    instagramNick: string;
    siteUrl?: string;
    showButtonToDashboard: boolean;
    onContinue?: () => void;
}

export function Profile({ name, description, avatarUrl, instagramNick, siteUrl, showButtonToDashboard, onContinue }: ProfileProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#1F1F1F] text-white w-full h-full px-4 pt-20 lg:px-[10%] overflow-y-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 py-8 w-full h-screen">
        <div className="flex flex-col items-start justify-center gap-1 max-w-80">
          <img
            className="w-28 h-28 rounded-2xl mb-4"
            src={`https://corsproxy.io/?${avatarUrl}`}
            crossOrigin="anonymous"
            alt="Imagem de perfil"
          />
          <h1 className="text-4xl font-light">{name}</h1>
          <p className="text-base font-light text-gray-400">
            {description}
          </p>

          <button className="flex flex-row items-center justify-center gap-1 bg-[#f7b57a] text-gray-800 px-6 py-3 mt-4 rounded-full hover:brightness-75 transition duration-150">
            <p className="text-sm font-medium">Pedir orçamento</p>
            <svg
              focusable="false"
              aria-hidden="true"
              width="20px"
              viewBox="0 0 24 24"
              data-testid="ArrowForwardIcon"
            >
              <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap w-full max-w-[400px] items-start justify-start gap-4 mr-0 lg:mr-[10%]">
            <a href={`https://instagram.com/${instagramNick}`} target="_blank" rel="noreferrer" className="flex flex-col items-start w-full max-w-48 gap-12 p-4 text-[#f7b57a] border border-gray-700 rounded-2xl hover:bg-gray-500 hover:text-white transition duration-150">
                <FaInstagram size={25} className="text-[#f7b57a]" />
                <p className="text-gray-300 text-base font-medium">Instagram</p>
            </a>
            {siteUrl && <a href={siteUrl} target="_blank" rel="noreferrer" className="flex flex-col items-start w-full max-w-48 gap-12 p-4 text-[#f7b57a] border border-gray-700 rounded-2xl hover:bg-gray-500 hover:text-white transition duration-150">
                <FiGlobe size={25} className="text-[#f7b57a]" />
                <p className="text-gray-300 text-base font-medium">Site</p>
            </a>}
        </div>

      </div>

      <div className="flex w-full h-96 items-end pb-8">
        <a
          href="https://www.assis.co/"
          target="_blank"
          rel="noreferrer"
          className="flex flex-row items-center gap-1 text-gray-400 hover:text-white transition duration-150"
        >
          <img src="/logo.svg" alt="Logo Assis" className="w-4 h-4" />
          Feito com Assis
        </a>
      </div>

      {showButtonToDashboard && (
        <button className="fixed bottom-8 right-8 z-50 flex flex-row items-center justify-center gap-1 bg-green-500 text-white px-6 py-3 rounded-full hover:brightness-75 transition duration-150"
        onClick={onContinue}
        >
            <p className="text-sm font-medium">Continuar</p>
            <svg
              focusable="false"
              aria-hidden="true"
              width="20px"
              viewBox="0 0 24 24"
              data-testid="ArrowForwardIcon"
                fill="white"
            >
              <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
            </svg>
        </button>
      )}
    </div>
  );
}
