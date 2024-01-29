interface ScrollingImagesProps {
  display: boolean;
  position: "left" | "right";
  scrollDirection: "up" | "down";
}

export function ScrollingImages({
  display,
  position,
  scrollDirection,
}: ScrollingImagesProps) {
  const positionClass = position === "right" ? "right-0" : "left-0";
  const scrollClass =
    scrollDirection === "down" ? "scrolling-down" : "scrolling-up";

  return (
    <div
      className={`absolute inset-y-0 ${positionClass} top-0 hidden lg:flex overflow-hidden`}
      style={display ? { display: "none" } : {}}
    >
      <div className={`scrolling-images ${scrollClass} max-w-96`}>
        <img src="/img/perfil1.png" alt="Perfil 1" />
        <img src="/img/perfil2.png" alt="Perfil 2" />
        <img src="/img/perfil3.png" alt="Perfil 3" />
        <img src="/img/perfil4.png" alt="Perfil 4" className="mb-16" />
        <img src="/img/perfil1.png" alt="Perfil 1" />
        <img src="/img/perfil2.png" alt="Perfil 2" />
        <img src="/img/perfil3.png" alt="Perfil 3" />
        <img src="/img/perfil4.png" alt="Perfil 4" className="mb-16" />
      </div>
    </div>
  );
}
