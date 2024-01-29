import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { messages, type, model } = req.body;

        try {
            const response = await gptRequest(messages, type, model);
            res.status(200).json({ text: response });
        } catch (error) {
            console.error(error);
            // res.status(500).json({ error: "Erro ao processar a requisição" });
            res.status(200).json({ text: "Profissionalismo, qualidade e agilidade são os meus principais valores. Estou pronto para conversar e impulsionar suas ideias! 🚀" });
        }
    } else {
        // res.status(405).json({ error: "Método não permitido" });
        res.status(405).json({ text: "Profissionalismo, qualidade e agilidade são os meus principais valores. Estou pronto para conversar e impulsionar suas ideias! 🚀" });
    }
}

async function gptRequest(messages: any[], type?: string, model?: string) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model || 'gpt-4-turbo-preview',
                messages: messages,
                max_tokens: 3500,
                response_format: { type: type || 'text' }
            })
        });

        const data = await response.json();
        return data.choices[0].message.content || 'Profissionalismo, qualidade e agilidade são os meus principais valores. Estou pronto para conversar e impulsionar suas ideias! 🚀';
    } catch (err) {
        console.error(err);
        return "Profissionalismo, qualidade e agilidade são os meus principais valores. Estou pronto para conversar e impulsionar suas ideias! 🚀";
    }
}
