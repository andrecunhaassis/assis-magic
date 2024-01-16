import { Profile } from "@/components/profile";
import { LoadingProgress } from "@/components/loading";
import { UserDataProps } from "@/interfaces";
import { gptRequest } from "@/services/openai";
import { useState } from "react";
import { Dashboard } from "@/components/dashboard";
import { promptChatbotConversation, promptSummaryConversation } from "@/prompt";
import { Modal } from "@/components/modal";
import Whatsapp from "@/components/whatsapp";

export default function Home() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<UserDataProps | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [botConversation, setBotConversation] = useState<any[] | null>(null);
  const [botSummary, setBotSummary] = useState<any | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showConversation, setShowConversation] = useState(false);

  async function handleSubmit(username: string) {
    if (!username) return;

    setLoadingStep(1);
    // get data from /api/instagram?username=andreocunha
    const response = await fetch(`/api/instagram?username=${username}`);
    const data = await response.json();
    const filteredData = {
      name: data.name,
      bio: data.bio,
      link: data.link,
    };

    setLoadingStep(2);
    const bio = await gptRequest([
      {
        role: "user",
        content: `A partir dos dados do perfil do instagram abaixo, faça um paragrafo em primeira pessoa (do singular ou plural), curto (máximo 150 caracteres e 1 emoji) para descrição profissional e persuasiva. Não adicione links nesse paragrafo:\n\n${JSON.stringify(
          filteredData
        )}`,
      },
    ]);
    setLoadingStep(3);
    setTimeout(() => {
      setUserData({
        name: data.name,
        bio: bio,
        img: data.img,
        nick: username,
        link:
          data.link && !data.link.includes("http")
            ? `https://${data.link}`
            : data.link,
      });
  
      setLoadingStep(0);
    }, 1000)

    const promptChatbot = promptChatbotConversation(`${data.name}\n${bio}`);
    // console.log('promptChatbot', promptChatbot);
    const resultConversation = await gptRequest([{
      "role": "system",
      "content": "You are a helpful assistant designed to output JSON."
    },{
      role: "user",
      content: promptChatbot,
    }], "json_object", "gpt-3.5-turbo-1106")

    console.log('resultConversation', resultConversation);

    const promptChatbotSummary = promptSummaryConversation(JSON.stringify(resultConversation));
    console.log('promptChatbotSummary', promptChatbotSummary);
    const resultSummary = await gptRequest([{
      "role": "system",
      "content": "You are a helpful assistant designed to output JSON."
    },{
      role: "user",
      content: promptChatbotSummary,
    }], "json_object", "gpt-3.5-turbo-1106")

    console.log('resultSummary', resultSummary);

    setBotConversation(JSON.parse(resultConversation)?.messages);
    setBotSummary(JSON.parse(resultSummary));
  }

  if(showDashboard && userData) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Dashboard 
          userData={userData}
          opportunity={{
            name: botSummary?.name || "Oportunidade",
            description: botSummary?.service + botSummary?.why || "Descrição da oportunidade",
          }}
          onShowConversationOpportunity={() => setShowConversation(true)}
          onShowSummaryOpportunity={() => setShowSummary(true)}
        />

      <Modal isOpen={showConversation} onClose={() => setShowConversation(false)}>
        <Whatsapp messages={botConversation || []} />
      </Modal>
      <Modal isOpen={showSummary} onClose={() => setShowSummary(false)}>
        <div>
          <p className="text-lg font-medium">
            Qual seu nome completo?
          </p>
          <p className="text-base font-light">
            {botSummary?.name}
          </p>

          <p className="text-lg font-medium mt-4">
            E seu WhatsApp?
          </p>
          <p className="text-base font-light">
            {botSummary?.phone || `(11) 99123-4567`}
          </p>

          <p className="text-lg font-medium mt-4">
            Quando o serviço deverá ser prestado?
          </p>
          <p className="text-base font-light">
            {botSummary?.date}
          </p>

          <p className="text-lg font-medium mt-4">
            Qual o serviço que você precisa?
          </p>
          <p className="text-base font-light">
            {botSummary?.service}
          </p>

          <p className="text-lg font-medium mt-4">
            "Por que?" O que você está buscando com esse Serviço?
          </p>
          <p className="text-base font-light">
            {botSummary?.why}
          </p>

          <p className="text-lg font-medium mt-4">
            Como conheceu meu trabalho?
          </p>
          <p className="text-base font-light">
            {botSummary?.how}
          </p>
        </div>
      </Modal>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      {userData ? (
        <div className="h-full w-full">
          <Profile
            name={userData.name}
            description={userData.bio}
            avatarUrl={userData.img}
            instagramNick={userData.nick}
            siteUrl={userData.link}
            showButtonToDashboard={botConversation && botSummary}
            onContinue={() => setShowDashboard(true)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-start justify-center gap-1">
          <div className="flex flex-row items-center justify-center gap-2">
            <input
              type="text"
              placeholder="Nick do instagram"
              className="border border-gray-300 rounded-md px-4 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit(username)}
            />
            <button
              type="button"
              onClick={() => handleSubmit(username)}
              className={`bg-[#f07026] text-white px-6 py-2 rounded-md hover:brightness-75 transition duration-150 ${
                (!username || loadingStep > 0) && "opacity-50 cursor-not-allowed"
              }`}
              disabled={!username || loadingStep > 0}
            >
              Enviar
            </button>
          </div>

          <div className="flex flex-col items-start justify-center mt-2">
            <LoadingProgress
              display={loadingStep >= 1}
              finished={loadingStep > 1}
              text="Coletando dados do Instagram"
            />
            {loadingStep >= 2 && (
              <LoadingProgress
                display={loadingStep >= 2}
                finished={loadingStep > 2}
                text="Montando seu perfil Assis"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
