import type { Request, Response } from "express";
import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.APIKEY,
})

const openai = new OpenAIApi(configuration)

const generatePromp = (text: string) => {
  return `Provide a JSON object with the detected emotions and tips for the phrase ${text} in Spanish.`
}

export const getFeelings = async (req: Request, res: Response) => {
  try {
    const text: string = req.body.text
    console.log(text);
    if (!text) res.status(400).json({ error: 'Por favor, incluya un texto de como se siente' })

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePromp(text),
      temperature: 0.7,
      max_tokens: 256,
    });

    const responsetext = completion.data.choices[0].text
    const newText = responsetext?.replace(/\n/g, "")

    if (newText) {
      res.status(200).json(JSON.parse(newText))
    } else {
      res.status(400).json({ error: 'No se pudo obtener una respuesta de tu texto' })
    }

  } catch (e) {
    console.log(e, "ERROR GET INFO");
    res.status(400).send({ error: "Error al generar una respuesta, vuelve a intentar más tarde" })
  }
};
