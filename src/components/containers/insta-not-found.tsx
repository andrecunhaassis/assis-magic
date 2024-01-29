import Image from "next/image";
import { useEffect } from "react";
import { FaRedoAlt } from "react-icons/fa";

export function InstaNotFound(){
    
    useEffect(() => {
        setTimeout(() => {
            const button = document.getElementById('try-again');
            if(button) {
                button.classList.remove('hidden');
                button.classList.add('flex');
            }
        }
        , 2000)
    }, [])

    return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-[#F5F5F5] relative gap-4">
        <Image
            src="/img/insta-logo.png"
            alt="Instagram Logo"
            width={90}
            height={90}
        />
        <p className="text-2xl font-light text-center max-w-72">
            Não encontramos o seu perfil do Instagram :(
        </p>

        <button
            className="items-center justify-center bg-[#f07026] text-white rounded-lg px-4 py-2 mt-4 gap-2 hover:brightness-75 transition duration-150 hidden"
            id="try-again"
            onClick={() => window.location.reload()}
        >
            <FaRedoAlt />
            Tentar novamente
        </button>
    </div>
    )
}