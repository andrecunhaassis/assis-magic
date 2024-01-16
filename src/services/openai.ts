import { MessageProps } from "@/interfaces";

export async function gptRequest(messages: MessageProps[], type?: string, model?: string) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model || 'gpt-4-1106-preview',
                messages: messages,
                max_tokens: 3500,
                response_format: { type: type || 'text' }
            })
        });

        const data = await response.json();
        return data.choices[0].message.content || 'PROBLEMAS NO GPT';
    }
    catch (err) {
        console.log(err);
        return err;
    }
}