import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { convertStringToDate } from "@/utils/date";

interface Data {
  row_index: number;
  full_name: string;
  description_profile: string;
  bio_insta: string;
  username_insta: string;
  profile_pic_url: string;
  links: string;
  email: string;
  company_name: string;
  business_vertical: string;
  secondary_color: string;
  gpt_success: string;
  gpt_count_usage: string;
  profile_count_generated: string;
  date_created: string;
}

const cors = Cors({
  methods: ["POST", "GET", "HEAD", "PUT"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

async function getSheet(tabSheet?: string) {
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.SHEET_CLIENT_EMAIL!,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n")!,
  });

  await doc.loadInfo();
  return doc.sheetsByTitle[tabSheet || "data"];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  // verifica se o token é válido Bearer
  const { authorization } = req.headers;
  let token = authorization?.split("Bearer ")[1];
  if (token !== process.env.NEXT_PUBLIC_SECRET_KEY) {
    return res.status(401).send({ error: "Não autorizado." });
  }

  const { method } = req;
  if (method === "GET") {
    // if has query params like ?field=full_name&value=John Doe
    if (req.query.field && req.query.value) {
      const { field, value } = req.query;
      await findUserByField(field as string, value as string, res);
      return;
    }
    await getData(res);
  }

  const { data } = req.body;

  if (method === "POST") {
    await saveUserProfile(res, data);
  }

  if (method === "PUT") {
    await updateUserProfile(res, data);
  }
}

// Pegar os dados da planilha
async function getData(res: NextApiResponse) {
  try {
    const sheet = await getSheet();

    const rows = await sheet.getRows();
    const data = rows.map((row) => {
      let rowData: { [key: string]: any } = {};
      for (let key of row._sheet.headerValues) {
        rowData[key] = row[key];
      }
      rowData.row_index = row.rowIndex;
      return rowData;
    });

    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Erro ao buscar dados." });
  }
}

async function findUserByField(
  field: string,
  value: string,
  res: NextApiResponse
) {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();

    // Filtra as linhas que correspondem ao campo e valor
    const filteredRows = rows.filter((row) => row[field] === value);

    if (filteredRows.length === 0) {
      return res.status(404).send({ error: "Usuário não encontrado." });
    }

    // Converte as datas em objetos Date e encontra o mais recente
    const latestRow = filteredRows.reduce((latest: any, row) => {
      const currentRowDate = new Date(convertStringToDate(row.date_updated));
      const latestRowDate = latest ? new Date(convertStringToDate(latest.date_updated)) : null;

      if (!latestRowDate || currentRowDate > latestRowDate) {
        return row;
      }

      return latest;
    }, null);

    // Prepara os dados para a resposta
    const data: { [key: string]: any } = {};
    for (let key of latestRow._sheet.headerValues) {
      if (key === "links") {
        try {
          data[key] = JSON.parse(latestRow[key] || "[]");
        } catch (err) {
          data[key] = [];
        }
      } else {
        data[key] = latestRow[key];
      }
    }
    data.row_index = latestRow.rowIndex;
    data.date_created = convertStringToDate(data.date_created);
    data.date_updated = convertStringToDate(data.date_updated);

    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    return res.status(404).send({ error: "Erro ao buscar dados." });
  }
}



async function saveUserProfile(res: NextApiResponse, data: Data) {
  try {
    const sheet = await getSheet();
    const date = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    await sheet.addRow({
      full_name: data?.full_name || "",
      description_profile: data?.description_profile || "",
      bio_insta: data?.bio_insta || "",
      username_insta: data?.username_insta || "",
      profile_pic_url: data?.profile_pic_url || "",
      links: data?.links ? JSON.stringify(data.links) : "",
      email: data?.email || "",
      company_name: data?.company_name || data?.full_name || "",
      business_vertical: data?.business_vertical || "",
      secondary_color: data?.secondary_color || "#f07026",
      gpt_count_usage: data?.gpt_count_usage || "",
      profile_count_generated: data?.profile_count_generated || "",
      date_created: date,
      date_updated: date,
    });
    return res.status(200).send({ status: "Salvo!" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Erro ao salvar dados." });
  }
}

async function updateUserProfile(res: NextApiResponse, data: Data) {
  try {
    if (data.row_index === undefined) {
      console.log("ID não fornecido.");
      return res.status(400).send({ error: "ID não fornecido." });
    }

    const sheet = await getSheet();
    const rowIndex = data.row_index - 2;

    // Obtenha uma faixa limitada de linhas, começando na linha específica
    const rows = await sheet.getRows({ limit: 1, offset: rowIndex });
    if (rows.length === 0) {
      console.log("Usuário não encontrado.");
      return res.status(404).send({ error: "Usuário não encontrado." });
    }

    const rowToUpdate = rows[0];
    Object.entries(data).forEach(([key, value]) => {
      if (key == "row_index") return;
      if (value !== undefined) {
        rowToUpdate[key] = value;
      }
    });

    rowToUpdate.date_updated = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    await rowToUpdate.save();
    return res.status(200).send({ status: "Atualizado!" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Erro ao salvar dados." });
  }
}
