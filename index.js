import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";

dotenv.config();
const app = express();

const apiURL = process.env.VITE_ENDPOINT_URL || "http://localhost:5173";

const myMemoryEmail = process.env.MYMEMORY_EMAIL;

app.use(express.json());

app.use(
  cors({
    origin: `${apiURL}`,
  })
);

app.post("/api/translate", async (req, res) => {
  const { q, source, target } = req.body;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      q
    )}&langpair=${source}|${target}&de=${encodeURIComponent(myMemoryEmail)}`;

    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Erro na API de tradução" });
    }
    const data = await response.json();
    res.json({ translatedText: data.responseData.translatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao traduzir" });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
