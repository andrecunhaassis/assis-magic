import { UserDataProps } from "@/interfaces";
import { dataFormatada, getGreeting } from "@/utils/date";

interface DashboardProps {
    userData: UserDataProps | null;
    opportunity: {
        name: string;
        description: string;
    }
    onShowSummaryOpportunity?: () => void;
    onShowConversationOpportunity?: () => void;
}

export function Dashboard({ userData, opportunity, onShowSummaryOpportunity, onShowConversationOpportunity }: DashboardProps) {
  return (
    <div className="flex flex-col items-start justify-start w-full h-screen max-w-[700px] p-8">
      <div className="flex flex-col w-full items-start justify-start gap-1">
        <h1 className="text-2xl font-normal">{getGreeting()}, {userData?.name.split(" ")[0]}</h1>
        <p className="text-xs font-light">{dataFormatada()}</p>
        <div className="w-full h-[1px] bg-gray-300 my-8" />
      </div>

      <div
        className="flex flex-row w-full items-start justify-between gap-1 border border-gray-300 rounded-xl p-4 bg-[#1F1F1F] text-white cursor-pointer"
        onClick={() => (window.location.href = "/profile/andre.cunha")}
      >
        <div>
          <h2 className="text-base font-medium">
            {userData?.name}
          </h2>
          <p className="text-sm font-light text-gray-400">
            {userData?.bio && userData?.bio
              .length > 70
              ? `${userData?.bio.slice(
                  0,
                  70
                )}...`
              : userData?.bio}
          </p>
          <a
            href={`https://app.assis.co/${userData?.nick}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-row items-center justify-start gap-1 mt-3 text-sm"
          >
            <img src="/logo2.png" alt="Logo Assis" className="w-4 h-4" />
            https://app.assis.co/{userData?.nick}
          </a>
        </div>
        <div className="flex flex-col items-center justify-center w-20 h-20 min-w-20 min-h-20">
          <img
            src={`/api/image-proxy/${encodeURIComponent(userData?.img!)}`}
            alt={userData?.name}
            className="w-20 h-20 rounded-lg"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      <div className="flex flex-col w-full items-start justify-start mt-12 gap-3">
        <p className="text-lg font-medium">Suas novas oportunidades:</p>

        <div className="flex flex-col w-full gap-1 p-4 cursor-pointer bg-white shadow-lg rounded-xl overflow-hidden"
            onClick={onShowSummaryOpportunity}
        >
          <h3 className="text-base font-semibold text-gray-800">
            {opportunity?.name} [criada com formulário comum]
          </h3>
          <p className="text-sm text-gray-400">
            {opportunity?.description.length > 165
              ? `${opportunity?.description.slice(
                  0,
                  165
                )}...`
              : opportunity?.description}
          </p>
          <p className="text-gray-700 text-xs mt-2">
            Solicitado há 10 minutos
          </p>
        </div>

        <div className="flex flex-col w-full gap-1 p-4 cursor-pointer bg-white shadow-lg rounded-xl overflow-hidden" onClick={onShowConversationOpportunity}>
          <h3 className="text-base font-semibold text-gray-800">
          {opportunity?.name} [criada com o bot de IA da Assis]
          </h3>
          <p className="text-sm text-gray-400">
            {opportunity?.description.length > 165
              ? `${opportunity?.description.slice(
                  0,
                  165
                )}...`
              : opportunity?.description}
          </p>
          <p className="text-gray-700 text-xs mt-2">
            Solicitado há 15 minutos
          </p>
        </div>
      </div>
    </div>
  );
}
