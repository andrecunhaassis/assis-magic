import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Inicialize o cliente OpenAI
const openai = new OpenAI();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Tratar apenas requisições POST
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    try {
        // Iniciar o stream da OpenAI
        const { message } = req.body;
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
            max_tokens: 250,
        });

        res.status(200).json({ message: completion.choices[0].message.content || '' });
    } catch (error) {
        console.error(error);
        res.status(500).end('Internal Server Error');
    }
}
