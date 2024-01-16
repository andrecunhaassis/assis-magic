import type { NextApiRequest, NextApiResponse } from 'next';

async function getInstaData(username: string): Promise<{ name: string[], bio: string[], img: string[], link: string[] }> {
    const data = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
    {
      headers: {
        authority: "www.instagram.com",
        accept: "*/*",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        cookie:
          "csrftoken=6VaDebQQw7jme4TLGTLWmc; dpr=1.25; ig_did=50DB6954-04F9-4807-8532-CC104CB4FD5B; ig_nrcb=1; datr=kzWdZfCchdw7uF82DGbcGmKW; mid=ZZ01lAALAAEFiOErwtnV0tsPUwWK",
        dpr: "1.25",
        referer: `https://www.instagram.com/${username}/`,
        "sec-ch-prefers-color-scheme": "light",
        "sec-ch-ua":
          '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "sec-ch-ua-full-version-list":
          '"Not_A Brand";v="8.0.0.0", "Chromium";v="120.0.6099.200", "Google Chrome";v="120.0.6099.200"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": '""',
        "sec-ch-ua-platform": '"Windows"',
        "sec-ch-ua-platform-version": '"15.0.0"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "viewport-width": "982",
        "x-asbd-id": "129477",
        "x-csrftoken": "6VaDebQQw7jme4TLGTLWmc",
        "x-ig-app-id": "936619743392459",
        "x-ig-www-claim": "0",
        "x-requested-with": "XMLHttpRequest",
      },
    }
    );
    const json = await data.json();
    const user = json.data.user;

    return { 
        name: user.full_name, 
        bio: user.biography, 
        img: user.profile_pic_url_hd || user.profile_pic_url,
        link: user.external_url
    };
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

        // Obter dados do Instagram;
        const { name, bio, img, link } = await getInstaData(username);

        // Criar objeto JSON
        const data = {
            name: name || "",
            bio: bio || "",
            img: img || null,
            link: link || ""
        };

        // Retornar o HTML como resposta
        res.status(200).json(data)
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

