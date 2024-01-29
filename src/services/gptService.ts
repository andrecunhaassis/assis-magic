export async function generateBio(filteredData: string) {
  if (!filteredData || filteredData === "{}") {
    console.error("Erro ao gerar biografia");
    return "Profissionalismo, qualidade e agilidade são os meus principais valores. Estou pronto para conversar e impulsionar suas ideias! 🚀";
  }
  try {
    const response = await fetch(`/api/gpt`, {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `A partir dos dados do perfil do instagram abaixo, faça um paragrafo em primeira pessoa (do singular ou plural), curto (máximo 150 caracteres e 1 emoji) para descrição profissional e persuasiva. Não adicione links nesse paragrafo:\n\n${filteredData}`,
          },
        ],
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Erro ao gerar biografia");
      return "Profissionalismo, qualidade e agilidade são os meus principais valores. Estou pronto para conversar e impulsionar suas ideias! 🚀";
    }
    const result = await response.json();
    return result.text;
  } catch (error) {
    console.error("Falha ao gerar biografia com IA:", error);
    return "Profissionalismo, qualidade e agilidade são os meus principais valores. Estou pronto para conversar e impulsionar suas ideias! 🚀";
  }
}

export async function generateCompanyAndCategory(filteredData: string) {
  if (!filteredData || filteredData === "{}") {
    console.error("Erro ao gerar empresa e categoria");
    return {
      company: null,
      category: "",
    };
  }
  try {
    const response = await fetch(`/api/gpt`, {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON.",
          },
          {
            role: "user",
            content: `A partir dos dados do perfil do instagram abaixo, retorne um JSON com os seguintes dados no formato {company: "nome como os clientes chamam a pessoa, se é da empresa ou nome próprio completo", category: "em uma palavra, em portugues, qual o tipo de serviço a pessoa presta (ex: fotografia, engenharia, consultoria, etc)"}:\n\n${filteredData}`,
          },
        ],
        type: "json_object",
        model: "gpt-3.5-turbo-1106",
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Erro ao gerar empresa e categoria");
      return {
        company: null,
        category: "",
      };
    }
    const result = await response.json();
    const jsonResult = JSON.parse(result.text);
    return {
      company: jsonResult.company,
      category: jsonResult.category,
    };
  } catch (error) {
    console.error("Falha ao gerar empresa e categoria com IA:", error);
    return {
      company: null,
      category: "",
    };
  }
}
