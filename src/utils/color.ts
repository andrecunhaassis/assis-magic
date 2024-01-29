import { extractColors } from "extract-colors";

function colorDistance(color1: any, color2: any) {
  return Math.sqrt(
    Math.pow(color2.red - color1.r, 2) +
      Math.pow(color2.green - color1.g, 2) +
      Math.pow(color2.blue - color1.b, 2)
  );
}

const myColors = [
  { r: 240, g: 112, b: 38, hex: "#f07026" },
  { r: 180, g: 58, b: 37, hex: "#b43a25" },
  { r: 140, g: 57, b: 103, hex: "#8c3967" },
  { r: 139, g: 99, b: 38, hex: "#8b6326" },
  { r: 100, g: 98, b: 28, hex: "#64621c" },
  { r: 73, g: 120, b: 49, hex: "#497831" },
  { r: 72, g: 127, b: 112, hex: "#487f70" },
  { r: 50, g: 85, b: 143, hex: "#32558f" },
  { r: 71, g: 32, b: 121, hex: "#472079" },
  { r: 31, g: 31, b: 31, hex: "#1f1f1f" },
];

export async function getColorImage(imageSrc: string) {
  try {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível obter o contexto do canvas");
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const colors = await extractColors(imageData);

    let closestColor = myColors[0];
    let minDistance = Number.MAX_VALUE;

    for (const color of colors) {
      for (const myColor of myColors) {
        const distance = colorDistance(myColor, color);
        if (distance < minDistance) {
          minDistance = distance;
          closestColor = myColor;
        }
      }
    }

    return closestColor.hex;
  } catch (error) {
    console.error(error);
    // throw new Error("Erro ao processar a imagem");
    return "#f07026";
  }
}
