import type { Request, Response } from "express";
import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.APIKEY,
})

const openai = new OpenAIApi(configuration)

const generatePromp = (text: string) => {
  return `Return JSON object validate feelings[""], steps[""] from phrase(spanish):${text}`
}

export const getFeelings = async (req: Request, res: Response) => {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePromp(req.body.text),
      temperature: 0.7,
      max_tokens: 256,
    });
    const text = completion.data.choices[0].text
    const newText = text?.replace(/\n/g, "")
    if (newText) {
      res.status(200).json(JSON.parse(newText))
    } else {
      res.status(400).json({ error: 'No se pudo obtener una respuesta de tu texto' })
    }
  } catch (e) {
    res.status(400).send({ error: "Error al generar una respuesta, vuelve a intentar más tarde" })
  }
};
