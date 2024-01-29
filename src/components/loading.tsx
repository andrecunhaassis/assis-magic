import { FaRegCheckCircle } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface LoadingSpinnerProps {
  display?: boolean;
}

export function LoadingSpinner({ display = true }: LoadingSpinnerProps) {
  if (!display) return null;
  return (
    <svg
      aria-hidden="true"
      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-300 fill-[#f07026]"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );
}

interface LoadingProgressProps {
  display?: boolean;
  finished?: boolean;
  text?: string;
}

export function LoadingProgress({
  display = true,
  finished = false,
  text = "",
}: LoadingProgressProps) {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!display) return null;

  return (
    <div className="flex flex-col w-full min-w-[300px] h-full min-h-screen items-center justify-between gap-2 p-4 py-12 rounded-lg text-center">
      <Image
        src="/img/wand2.svg"
        alt="Varinha mágica"
        width={40}
        height={40}
      />

    <div className="flex flex-col items-center justify-center gap-2">
      {finished ? (
        <FaRegCheckCircle className="text-green-500" size={80} />
      ) : (
        <div className="relative">
          <svg
            aria-hidden="true"
            className="w-[70px] h-[70px] text-gray-400 animate-spin fill-[#E5E5E5]"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black font-bold"
            style={{ fontSize: "30px" }}
          >
            {countdown}
          </span>
        </div>
      )}

      <p
        className={`text-2xl max-w-56 font-light ${
          finished ? "text-green-500" : "text-black"
        }`}
      >
        {text}
      </p>
      </div>

      <div className="flex items-center justify-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-lg">
        <Image src="/logo2.png" alt="Logo Assis" width={20} height={20} />
        <p className="text-sm text-gray-800">Criando com a IA da Assis</p>
      </div>
    </div>
  );
}
