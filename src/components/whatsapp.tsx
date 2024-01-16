import { Message } from "./message";
import { useState } from "react";

interface Message {
  id: number;
  role: string;
  content: any;
  timestamp: string;
}

interface WhatsappProps {
  messages: Message[];
}

export default function Whatsapp({ messages }: WhatsappProps) {
  return (
    <div className="flex flex-col text-white justify-center items-center w-full h-full min-w-[400px] lg:min-w-[1200px] max-h-[800px] bg-[#0C141A] bg-[url('/img/wpp-background-2.png')]">
      <div className="flex flex-row bg-[#1F2C33] w-full h-16 top-0 left-0 px-6 py-3">
        <img src="/img/logo-assis.jpeg" alt="Logo" className="h-10 rounded-full" />
        <div className="flex flex-col ml-4">
          <h1 className="text-lg font-bold">Bot Assis</h1>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </div>
      <div className="flex flex-col-reverse items-end h-screen w-full pb-20 pt-20 overflow-y-auto gap-2 px-4 lg:px-10">
        {[...messages]?.reverse().map((message, index) => (
          <Message
            key={index}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}
      </div>
      <div className="bg-[#1F2C33] w-full h-16 bottom-0 left-0 px-6 py-3">
        <input
          type="text"
          className="bg-[#2A3942] w-full h-10 px-4 text-white rounded-lg focus:outline-none"
          placeholder="Type a message"
        />
      </div>
    </div>
  );
}
