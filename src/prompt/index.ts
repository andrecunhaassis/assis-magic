
export function promptChatbotConversation(userInfo: string){
    return `Crie uma conversa fictícia de whatsapp entre o bot de primeiro contato da Assis que está representando a empresa da pessoa abaixo. A conversa deve ser um array com o seguinte formato:
{
messages:
[
{
role: "user",
content: "A mensagem aqui"
},
{
role: "assistant",
content: "A outra mensagem aqui"
}
]
}

A empresa que o bot está representando é:
${userInfo}

Na conversa o bot deve coletar essas informações:
1) O que deseja ou precisa (Serviço desejado)?; 2) Nome completo; 3) Data e se tem urgência para fazer o serviço; 4) O que você está buscando com esse Serviço?; 5) O local (se necessário); 6) Como conheceu o trabalhado da empresa?; 7) Pergunte se tem mais algum detalhe importante a acrescentar.

Obs: A primeira mensagem do bot é uma apresentação dele como "a Assis, assistente digital do..." com um pequeno resumo do que a empresa que ela está representando faz e perguntando em seguida algo a pessoa. Só pode ter 1 pergunta por mensagem do bot. Finaliza a conversa com o bot falando que vai passar as informações para a empresa/pessoa que ela está representando.`
}

export function promptSummaryConversation(conversation: string){
    return `Retorne um JSON com as informações coletadas na conversa abaixo:
Formato do JSON:
{
    "name": "Nome completo",
    "phone": "Telefone",
    "date": "Data",
    "service": "Serviço desejado",
    "why": "O que você está buscando com esse Serviço?",
    "how": "Como conheceu o trabalhado da empresa?"
}

Conversa:
${conversation}`
}