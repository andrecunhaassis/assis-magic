import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { load } from "cheerio";
// const Cors = require('cors')
import Cors from "cors";

const cors = Cors({
  methods: ["POST", "HEAD", "GET"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { url }: { url?: string } = req.query;

  if (!url) {
    return res.status(200).json({ links: [] });
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  await runMiddleware(req, res, cors);

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    const html = response.data;
    const $ = load(html);
    const linkElements = $("a").get();
    let links: any[] = [];

    const firstFiveLinkElements = linkElements.slice(0, 4);

    if(!url.includes("wa.me")){
      const linkPromises = firstFiveLinkElements
        .map((element) => {
          const href = $(element).attr("href");
          if (
            href &&
            href !== "/" &&
            (href.startsWith("http://") || href.startsWith("https://"))
          ) {
            return getTitleAndImage(href).then(({ title, imageUrl }) => ({
              href,
              title,
              imageUrl,
            }));
          } else {
            return null;
          }
        })
        .filter((p) => p !== null);

      links = await Promise.all(linkPromises);
    }

    // Incluir o URL original, seu título e imagem no array
    const originalTitle = $("title").text() || url.replace("https://", "").replace("http://", "").replace("www.", "").split(".")[0].substring(0, 35) || "Site";
    const originalImage = getImageUrl(html);
    links.unshift({ href: url, title: originalTitle, imageUrl: originalImage });

    return res.status(200).json({ links });
  } catch (error: any) {
    console.error(`Error fetching links for ${url}: ${error.message}`);
    return res.status(200).json({ links: [] });
  }
}

const getTitleAndImage = async (url: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    const html = response.data;
    const $ = load(html);

    let title = $("title").text() || $("h1").text() || $("h2").text() || $("h3").text();

    title = title.trim();
    if (!title) {
      title = "Site";
    } else {
      title = title.substring(0, 35);
    }

    const imageUrl = getImageUrl(html);
    return { title, imageUrl };
  } catch (error: any) {
    console.error(
      `Error fetching title and image for ${url}: ${error.message}`
    );
    // the title is the url between http:// or www. and .com
    const title = url
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "")
      .split(".com")[0]
      .substring(0, 35);
    return { 
      title: title || "Site",
      imageUrl: "" 
    };
  }
};

const getImageUrl = (html: string) => {
  const $ = load(html);
  const ogImage = $('meta[property="og:image"]').attr("content");
  if (ogImage) {
    return ogImage;
  }
  const firstImage = $("img").first().attr("src");
  return firstImage || `/img/default-${Math.floor(Math.random() * (7 - 1 + 1)) + 1}.png`;
};
