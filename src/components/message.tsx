interface MessageProps {
  role: string;
  content: string;
  timestamp: string;
}

export function Message({ role, content, timestamp }: MessageProps) {
  const formatTime = (dateString: string) => {
    if(!dateString) return new Date().toLocaleTimeString();
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formattedTime = formatTime(timestamp);

  if (role === "assistant") {
    return (
      <div className="bg-[#1F2C33] max-w-[300px] lg:max-w-[500px] rounded-lg rounded-tl-none px-4 py-2 self-start flex flex-col">
        <p className="text-sm">{content}</p>
        <p className="text-xs text-gray-400 self-end">{formattedTime}</p>
      </div>
    );
  }
  return (
    <div className="bg-[#015C4B] max-w-[300px] lg:max-w-[500px] rounded-lg rounded-tr-none px-4 py-2 flex flex-col">
      <p className="text-sm">{content}</p>
      <p className="text-xs text-gray-400 self-end">{formattedTime}</p>
    </div>
  );
}
