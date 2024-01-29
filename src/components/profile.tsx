import { useState, useEffect } from "react";
import { FaInstagram, FaRegStar } from "react-icons/fa";
import { VscTools } from "react-icons/vsc";
import { IoLocationOutline } from "react-icons/io5";
import { FiGlobe } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { Modal } from "./modal";
import LinkCard from "./link-card";

interface ProfileProps {
  name: string;
  description: string;
  avatarUrl: string;
  instagramNick: string;
  links: {
    href: string;
    title: string;
    imageUrl?: string;
    icon?: React.ReactNode | null;
  }[];
  email: string;
  color?: string;
  setEmail: (email: string) => void;
  onSubmit?: () => void;
}

export function Profile({
  name,
  description,
  avatarUrl,
  instagramNick,
  links,
  email,
  color = "#f07026",
  setEmail,
  onSubmit,
}: ProfileProps) {
  const [showModal, setShowModal] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [finalLinks, setFinalLinks] = useState(links);
  const randomNum = Math.floor(Math.random() * (7 - 1 + 1)) + 1;

  const fakeLinksData = [
    {
      href: "#",
      title: "Meu Portfólio",
      imageUrl: `/img/default-${randomNum}.png`,
    },
    {
      href: "#",
      title: "Avaliações dos clientes",
      icon: <FaRegStar size={25} className="text-[#f07026]" style={{ color }} />,
    },
    {
      href: "#",
      title: "Serviços",
      icon: <VscTools size={25} className="text-[#f07026]" style={{ color }} />,
    },
    {
      href: "#",
      title: "Localização",
      icon: <IoLocationOutline size={25} className="text-[#f07026]" style={{ color }} />,
    },
  ];

  useEffect(() => {
    // percorrer links e completar com fakeLinksData até ter 4 links
    if(links?.length < 4) {
      const newLinks = [...links];
      for(let i = 0; i < 4 - links?.length; i++) {
        newLinks.push(fakeLinksData[i]);
      }
      setFinalLinks(newLinks);
    }

    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start md:justify-center bg-[#FFFFFF] text-black w-full h-full min-h-screen px-4 pt-10 md:pt-32 lg:px-[10%] overflow-y-auto">
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex flex-col w-full gap-2 p-2">
          <div className="flex flex-row items-center justify-between text-center mb-4">
            <img src="/cloud.svg" alt="Nuvem" className="w-14 h-14 p-0 m-0" />
            <p className="text-xl text-gray-700 font-normal">
            Continue para editar e publicar seu site
            </p>
            <button
              className="border border-gray-400 rounded-full p-2 ml-4"
              onClick={() => setShowModal(false)}
            >
              <IoCloseOutline size={22} className="text-gray-700" />
            </button>
          </div>
          

          <label htmlFor="email" className="text-base text-gray-700 font-normal text-start">
            E-mail:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-400 text-black rounded-xl px-3 py-2 text-lg"
            placeholder="seu-email@gmail.com"
          />
          <button
            type="button"
            className={`bg-[#F07026] text-white px-6 py-2 mt-4 rounded-full hover:brightness-75 transition duration-150 w-fit self-end ${!email && "opacity-50 cursor-not-allowed"}`}
            disabled={!email}
            onClick={() => {
              if(!email) return;
              onSubmit && onSubmit();
              setShowModal(false);
            }}
          >
            Salvar e continuar
          </button>
        </div>
      </Modal>

      <div className="flex flex-col lg:flex-row items-center justify-start lg:justify-between gap-4 py-8 w-full h-full">
        <div className="flex flex-col items-start justify-center gap-1 max-w-80">
          <img
            className="w-28 h-28 rounded-2xl mb-4"
            src={`/api/image-proxy/${encodeURIComponent(avatarUrl)}`}
            onError={(e) => {
              e.currentTarget.src = "/img/user.png";
            }}
            crossOrigin="anonymous"
            alt="Imagem de perfil"
          />
          <h1 className="text-4xl font-light">{name || "Seu Nome"}</h1>
          <p className="text-base font-light text-gray-500">{description}</p>

          <button className={`flex flex-row items-center justify-center gap-1 bg-[#f07026] text-white px-6 py-3 mt-4 rounded-full hover:brightness-75 transition duration-150 w-full md:w-auto`} onClick={() => setShowModal(true)} style={{ backgroundColor: color }}>
            <p className="text-sm font-medium">Pedir orçamento</p>
            <svg
              focusable="false"
              aria-hidden="true"
              width="20px"
              viewBox="0 0 24 24"
              data-testid="ArrowForwardIcon"
              className="fill-current"
            >
              <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
            </svg>
          </button>
        </div>

        <div
          className={`flex flex-wrap w-full max-w-80 md:max-w-full lg:max-w-[650px] gap-4 mr-0 mb-8 lg:mr-[10%] mt-4 items-start ${
            links?.length > 1 ? "justify-center" : "justify-start"
          } md:justify-center lg:justify-end`}
        >
          {finalLinks?.length > 0 && (
            <LinkCard
              onClick={() => setShowModal(true)}
              link={finalLinks[0]}
              color={color}
              image={finalLinks[0]?.imageUrl || `/img/default-${randomNum}.png`}
              icon={<FiGlobe size={25} className={`text-[#f07026]`} style={{ color }} />}
              customClassName="group relative flex flex-row items-center justify-between w-full max-w-[425px] h-[140px] p-4 gap-4 text-[#f07026] border border-gray-200 shadow-md rounded-2xl hover:bg-gray-100 hover:text-black transition duration-150"
            />
          )}
          {finalLinks?.length > 0 &&
            finalLinks?.slice(1, 4)?.map((link, index) => (
            <LinkCard
              onClick={() => setShowModal(true)} 
              key={index} 
              link={link} 
              color={color}
              icon={link?.icon || <FiGlobe size={25} className={`text-[#f07026]`} style={{ color }} />}
            />
          ))}
          <LinkCard
            onClick={() => setShowModal(true)}
            link={{
              href: `https://instagram.com/${instagramNick}`,
              title: "Instagram",
            }}
            color={color}
            icon={<FaInstagram size={25} className="text-[#f07026]" style={{ color }} />}
          />
        </div>

        <div className="md:hidden flex w-full items-center justify-center pb-8 mt-8">
          <a
            href="https://www.assis.co/"
            target="_blank"
            rel="noreferrer"
            className="flex flex-row items-center gap-1 text-gray-400 hover:text-black transition duration-150"
          >
            <img src="/logo.svg" alt="Logo Assis" className="w-4 h-4" />
            Feito com Assis
          </a>
        </div>
      </div>

      <div className="md:flex hidden w-full items-end pb-8 mt-8">
        <a
          href="https://www.assis.co/"
          target="_blank"
          rel="noreferrer"
          className="flex flex-row items-center gap-1 text-gray-400 hover:text-black transition duration-150"
        >
          <img src="/logo.svg" alt="Logo Assis" className="w-4 h-4" />
          Feito com Assis
        </a>
      </div>

      {showButton && (
        <button
          className={"flex flex-row items-center justify-center text-white floating-button bg-[#f07026] px-6 py-4 gap-2 rounded-full hover:brightness-75 transition duration-150 fixed bottom-4 z-10 mx-4" + (showModal ? " hidden" : "")}
          onClick={() => setShowModal(true)}
        >
          <img src="/cloud-white.svg" alt="Nuvem" className="w-5 h-5" />
          Publicar meu site
        </button>
      )}
    </div>
  );
}
