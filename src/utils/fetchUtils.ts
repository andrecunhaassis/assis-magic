import { getColorImage } from "./color";

export async function fetchColorImage(imageUrl: string) {
  try {
    return await getColorImage(
      `/api/image-proxy/${encodeURIComponent(imageUrl)}`
    );
  } catch (error) {
    console.error("Falha ao buscar cor da imagem:", error);
    return "#f07026";
  }
}

export async function fetchLinks(url: string) {
  try {
    const response = await fetch(`/api/links?url=${url}`);
    if (!response.ok) {
      console.error("Erro ao buscar links");
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar links:", error);
    return null;
  }
}
