import type { NextApiRequest, NextApiResponse } from 'next';

const fetchUser = async (username: string) => {
    const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const headers = {
        'x-ig-app-id': '936619743392459',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': '*/*',
        'Referer': 'https://www.instagram.com/',
        'Origin': 'https://www.instagram.com',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty'
    };

    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
        throw new Error('Received HTML response instead of JSON. Possibly a login page.');
    }

    const data = await response.json();

    if (!data || !data.data || !data.data.user) {
        throw new Error('Invalid data structure');
    }

    const user = data.data.user;

    return {
        name: user.full_name,
        bio: user.biography,
        img: user.profile_pic_url_hd || user.profile_pic_url,
        link: user.external_url,
        allLinks: user.bio_links ? user.bio_links.map((link: any) => link.url) : [],
    };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { username } = req.query;

    if (!username || typeof username !== 'string') {
        res.status(400).json({ error: 'Invalid username' });
        return;
    }

    try {
        const userData = await fetchUser(username as string);
        res.status(200).json(userData);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
