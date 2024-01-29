import { selectRandomAgent } from "@/utils/agents";
import type { NextApiRequest, NextApiResponse } from "next";

async function getInstaProfile(username: string) {
  const response = await fetch("https://www.instagram.com/api/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,pt;q=0.8",
      "content-type": "application/x-www-form-urlencoded",
      dpr: "2",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "sec-ch-ua-full-version-list":
        '"Not_A Brand";v="8.0.0.0", "Chromium";v="120.0.6099.216", "Google Chrome";v="120.0.6099.216"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-model": '"Nexus 5"',
      "sec-ch-ua-platform": '"Android"',
      "sec-ch-ua-platform-version": '"6.0"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "viewport-width": "391",
      "x-asbd-id": "129477",
      "x-csrftoken": "741V6YtcYYy9fSRbfVoFTjfNz6TVPSlR",
      "x-fb-friendly-name": "PolarisSearchBoxRefetchableQuery",
      "x-fb-lsd": "1yCFKSZdVtYrZQZAy0yjXj",
      "x-ig-app-id": "936619743392459",
      "user-agent": selectRandomAgent(),
    },
    referrer: "https://www.instagram.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `av=17841464122554728&__d=www&__user=0&__a=1&__req=19&__hs=19740.HYP%3Ainstagram_web_pkg.2.1..0.1&dpr=2&__ccg=UNKNOWN&__rev=1010884746&__s=8mkysf%3Aq8i8sr%3Af1dqa0&__hsi=7325490690255601692&__dyn=7xeUjG1mxu1syUbFp60DU98nwgU7SbzEdF8aUco2qwJxS0k24o0B-q1ew65xO2O1Vw8G1nzUO0n24oaEd86a3a1YwBgao6C0Mo2iyovw8OfK0EUjwGzEaE7622362W2K0zK5o4q3y1Sx-0iS2Sq2-azqwt8dUaob82cwMwrUdUbGwmk1xwmo6O1FwlE6PhA6bxy4UjK5V8&__csr=gJ7gthjf5EV1ZiOiFqOsKFsCO2HFmAGblfZ4n9GRiJpqi8aGAEDDGmboDzpt2mhAARBLChC9yKiaUCSmV6QmAGxmvGmmcJ15kpaK-eXAyUCcV98W9UkhoOdG4V8K00jlR4wvp605k9607gE0mmiycgUYg0-888qwko2gwBw3ao28wavc0Fosga9Q9Bg3CwTga82yBkw1MoBw7lw0aa2&__comet_req=7&fb_dtsg=NAcMeN_uLR5Ee1x4OozwBwAXqTpMRXonmnaREidmkUzBJxzdRiZhGgQ%3A17843671327157124%3A1705501783&jazoest=26589&lsd=1yCFKSZdVtYrZQZAy0yjXj&__spin_r=1010884746&__spin_b=trunk&__spin_t=1705598712&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=PolarisSearchBoxRefetchableQuery&variables=%7B%22data%22%3A%7B%22context%22%3A%22blended%22%2C%22include_reel%22%3A%22true%22%2C%22query%22%3A%22${encodeURIComponent(
      username
    )}%22%2C%22rank_token%22%3A%221705598730526%7C855d7f70f015cd0128b5a8be38d60297c7c839d77a0a34ed98808b458b666e1e%22%2C%22search_surface%22%3A%22web_top_search%22%7D%2C%22hasQuery%22%3Atrue%7D&server_timestamps=true&doc_id=6901177919928333`,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  const result = await response.json();
  return result.data.xdt_api__v1__fbsearch__topsearch_connection.users;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Tratar apenas requisições GET
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    // Obter o nome de usuário do parâmetro de consulta
    const { username } = req.query;

    // Verificar se o nome de usuário foi fornecido
    if (!username || typeof username !== "string") {
      res.status(400).end("Bad Request: Username is required");
      return;
    }

    // Obter dados do Instagram;
    const data = await getInstaProfile(username);

    // Retornar o HTML como resposta
    res.status(200).json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
