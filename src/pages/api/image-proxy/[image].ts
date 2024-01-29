// pages/api/image-proxy/[image].ts
import { NextApiRequest, NextApiResponse } from "next";
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { image } = req.query;
    if(!image) return res.status(400).json({ error: 'Bad Request: Image is required' });

    try {
        const imageUrl = decodeURIComponent(image.toString());
        const imageRes = await fetch(imageUrl);

        // Verifica se a imagem foi carregada com sucesso
        if (!imageRes.ok) throw new Error(`Falha ao carregar a imagem: ${imageRes.statusText}`);

        // Configura o tipo de conteúdo apropriado
        const contentType = imageRes.headers.get('content-type');
        res.setHeader('Content-Type', contentType!);

        // Envia a imagem como resposta
        const buffer = await imageRes.buffer();
        res.send(buffer);
    } catch (error: any) {
        // Lida com qualquer erro que possa ocorrer
        res.status(500).json({ error: error.message });
    }
}
