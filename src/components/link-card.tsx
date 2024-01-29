import React from "react";
import { FiGlobe } from "react-icons/fi";
import { MdOutlineModeEditOutline } from "react-icons/md";

interface LinkCardProps {
  link: {
    href: string;
    title: string;
    imageUrl?: string;
  };
  color: string;
  icon?: React.ReactNode | null;
  customClassName?: string;
  image?: string;
  onClick?: () => void;
}

const LinkCard = ({
  link,
  color,
  icon,
  customClassName,
  image,
  onClick,
}: LinkCardProps) => {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const finalTitle = link.title.charAt(0).toUpperCase() + link.title.slice(1);

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      className={
        customClassName ||
        "group relative flex flex-col items-start justify-between w-full max-w-[150px] md:max-w-[205px] h-[140px] p-4 text-[#f07026] border border-gray-200 shadow-md rounded-2xl hover:bg-gray-100 hover:text-black transition duration-150"
      }
      style={{ color: color }}
      onClick={handleClick}
    >
      <div
        className="hidden group-hover:block absolute -top-3 -right-3 p-1 rounded-full bg-black text-white"
        onClick={handleClick}
      >
        <MdOutlineModeEditOutline size={20} />
      </div>
      {image ? (
        <img
          src={image}
          alt="Link"
          className="max-w-48 w-auto h-full rounded-lg bg-gray-300"
        />
      ) : (
        icon || (
          <FiGlobe size={25} className={`text-[#f07026]`} style={{ color }} />
        )
      )}

      <p className="text-gray-800 text-base font-normal break-all w-full">
        {finalTitle?.length > 35
          ? finalTitle?.substring(0, 35) + "..."
          : finalTitle}
      </p>
    </a>
  );
};

export default LinkCard;
