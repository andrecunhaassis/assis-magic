import { selectRandomAgent } from '@/utils/agents';
import type { NextApiRequest, NextApiResponse } from 'next';

// Função para fazer a requisição com diferentes cabeçalhos
async function fetchWithRetry(username: string, headers: any, maxRetries: number = 2): Promise<any> {
  let attempts = 0;
  while (attempts < maxRetries) {
      try {
          const response = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`, { headers });
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.json();
      } catch (error) {
          attempts++;
          if (attempts >= maxRetries) {
              throw error;
          }
      }
  }
}

async function getInstaData(username: string): Promise<{ name: string, bio: string, img: string, link: string }> {
  const headers1 = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,pt;q=0.8",
    "dpr": "2",
    "sec-ch-prefers-color-scheme": "dark",
    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
    "sec-ch-ua-full-version-list": "\"Not_A Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"120.0.6099.234\", \"Google Chrome\";v=\"120.0.6099.234\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-model": "\"Nexus 5\"",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-ch-ua-platform-version": "\"6.0\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "viewport-width": "486",
    "x-asbd-id": "129477",
    "x-csrftoken": "ORyQicSLw7CkMuHEA5KOWeWcFEfo2nVY",
    "x-ig-app-id": "1217981644879628",
    "x-ig-www-claim": "hmac.AR2kAxqonDTky9pz0a0L_TzH3E_QFfM-yNV3-NgAGrl88xFR",
    "x-requested-with": "XMLHttpRequest",
    "cookie": "ig_did=94FCA36D-E1A6-45DA-B116-A91FC4793AA2; ig_nrcb=1; mid=ZZxVOwABAAEqpFWilbfOp-Kb073r; datr=RlWcZW_r82JIpz_Bw7WpO5IN; dpr=1; csrftoken=ORyQicSLw7CkMuHEA5KOWeWcFEfo2nVY; ds_user_id=64197825418; sessionid=64197825418%3A6x6b45EZjiFi1K%3A22%3AAYfssLddK-61_teqk4X8-T0cqOQjIeIiKMyO4P_ofw; rur=\"EAG\\05464197825418\\0541737492573:01f741edd507007d344669ae5c74ea697a2d2f28643d485332b7de0c2e2c8d2d6162ae84\"; igd_ls=%7B%22c%22%3A%7B%221%22%3A%22HCwRAAAWigMW0LGXjQUTBRaW6uWEoJyzPwA%22%2C%222%22%3A%22GSwVQBxMAAAWARa80_baDBYAABV-HEwAABYAFrzT9toMFgAAFigA%22%7D%2C%22d%22%3A%228b7f9e01-3f04-45b9-973e-5842550ac4be%22%2C%22s%22%3A%220%22%2C%22u%22%3A%22lj0m6q%22%7D",
    "Referer": `https://www.instagram.com/${encodeURIComponent(username)}`,
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "User-Agent": selectRandomAgent(),
  };

  const headers2 =  {
    authority: "www.instagram.com",
    accept: "*/*",
    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    cookie:
      "csrftoken=6VaDebQQw7jme4TLGTLWmc; dpr=1.25; ig_did=50DB6954-04F9-4807-8532-CC104CB4FD5B; ig_nrcb=1; datr=kzWdZfCchdw7uF82DGbcGmKW; mid=ZZ01lAALAAEFiOErwtnV0tsPUwWK",
    dpr: "1.25",
    referer: `https://www.instagram.com/${encodeURIComponent(username)}/`,
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
  };

  try {
      const json = await fetchWithRetry(username, headers1);
      const user = json.data.user;
      return { 
          name: user.full_name, 
          bio: user.biography, 
          img: user.profile_pic_url_hd || user.profile_pic_url,
          link: user.external_url
      };
  } catch {
      const json = await fetchWithRetry(username, headers2);
      const user = json.data.user;
      return { 
          name: user.full_name, 
          bio: user.biography, 
          img: user.profile_pic_url_hd || user.profile_pic_url,
          link: user.external_url
      };
  }
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