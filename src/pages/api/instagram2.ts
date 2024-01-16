import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

async function getInstaData(url: string): Promise<{ name: string[], bio: string[], img: string[], link: string[] }> {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();

    // Acessa o URL
    await page.goto(url);

    // Espera aparecer o _a993 _a994 class
    await page.waitForSelector('._a993._a994');

    const name = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.x1s688f.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj'));
        return anchors.map(anchor => anchor.textContent || '');
    });

    // get the text of <h1>
    const bio = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('h1'));
        return anchors.map(anchor => anchor.textContent || '');
    });

    // Obtém todas as imagens dessa classe
    const img = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('._a993._a994'));
        return anchors.map(anchor => anchor.getElementsByTagName('img')[0]?.src || '');
    });

    // get the text of class x3nfvp2
    const link = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.x1s688f.x7l2uk3.x10wh9bi.x1wdrske.x8viiok.x18hxmgj'));
        return anchors.map(anchor => anchor.textContent || '');
    });
    

    // Fecha o browser
    await browser.close();

    return { name, bio, img, link };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Tratar apenas requisições GET
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        // Obter o nome de usuário do parâmetro de consulta
        const { username } = req.query;

        // Verificar se o nome de usuário foi fornecido
        if (!username || typeof username !== 'string') {
            res.status(400).end('Bad Request: Username is required');
            return;
        }

        // Obter dados do Instagram
        const url = `https://www.instagram.com/${username}/`;
        const { name, bio, img, link } = await getInstaData(url);

        // Criar objeto JSON
        const data = {
            name: name[0] || "",
            bio: bio[0] || "",
            img: img[0] || null,
            link: link[0] || ""
        };

        // Retornar o HTML como resposta
        res.status(200).json(data)
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

