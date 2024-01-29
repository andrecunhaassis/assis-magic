import { FaInstagram } from "react-icons/fa";
import { FiGlobe } from "react-icons/fi";
import React, { useState, useEffect } from "react";

interface ProfileProps {
  name: string;
  avatarUrl: string;
}

export function ProfileFake({ name, avatarUrl }: ProfileProps) {
  const [image, setImage] = useState('/img/user.png');
  const [fullName, setFullName] = useState("Nome");

  useEffect(() => {
    setTimeout(() => {
      setImage(avatarUrl);
      setFullName(name);
    }, 2000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start md:justify-center bg-[#FFFFFF] text-black w-full h-full min-h-screen px-4 pt-10 md:pt-32 lg:px-[10%] overflow-y-auto blur-effect">
      <div className="flex flex-col lg:flex-row items-center justify-start lg:justify-between gap-4 py-8 w-full h-full">
        <div className="flex flex-col w-full items-start justify-center gap-1 max-w-80">
          <img
            className="w-28 h-28 rounded-2xl mb-4"
            src={
              image == "/img/user.png" ? "/img/user.png" : `/api/image-proxy/${encodeURIComponent(image)}`
            }
            onError={(e) => {
              e.currentTarget.src = "/img/user.png";
            }}
            crossOrigin="anonymous"
            alt="Imagem de perfil"
          />
          <h1 className="text-4xl font-light">{fullName}</h1>
          <p className="text-base font-light text-gray-400 typing-effect">Lorem ipsum dolor sit amet consectetur</p>
          <p className="text-base font-light text-gray-400 display-text">
          adipisicing elit. Quisquam, voluptatibus. Lorem, ipsum dolor sit adipisicing elit.</p>

          
          <button className="flex flex-row items-center justify-center gap-1 bg-[#D1D1D1] text-white  px-6 py-3 mt-4 rounded-full hover:brightness-75 transition duration-150 w-full md:w-auto">
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

        <div className="flex flex-wrap w-full max-w-80 md:max-w-full lg:max-w-[630px] gap-4 mr-0 mb-8 lg:mr-[10%] mt-4 items-start justify-center md:justify-center lg:justify-end animate-pulse display-cards">
          <a
            href={`https://instagram.com`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-row items-center justify-around w-full max-w-[375px] h-[155px] md:h-[130px] gap-8 p-4 text-[#D1D1D1] border border-gray-700 rounded-2xl hover:bg-gray-500 hover:text-black transition duration-150"
          >
            <div className="max-w-48 w-[150px] h-[100px] rounded-lg bg-gray-300 animate-pulse"></div>
            <p className="text-gray-300 text-base font-medium break-all">
              Criando o perfil
            </p>
          </a>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-start w-full max-w-[150px] md:max-w-[180px] h-[155px] lg:h-auto gap-12 p-4 text-[#D1D1D1] border border-gray-700 rounded-2xl hover:bg-gray-500 hover:text-black transition duration-150"
                key={index}
              >
                <FiGlobe size={25} className="text-[#D1D1D1]" />
                <p className="text-gray-300 text-base font-medium">
                  Tesas asdasdasd
                </p>
              </a>
            ))}
          <a
            href={`https://instagram.com/`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-start w-full max-w-[150px] md:max-w-[180px] h-[155px] lg:h-auto gap-12 p-4 text-[#D1D1D1] border border-gray-700 rounded-2xl hover:bg-gray-500 hover:text-black transition duration-150"
          >
            <FaInstagram size={25} className="text-[#D1D1D1]" />
            <p className="text-gray-300 text-base font-medium">Instagram</p>
          </a>
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
    </div>
  );
}
