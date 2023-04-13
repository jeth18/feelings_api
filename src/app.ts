import express from 'express'
import cors from 'cors'
import { getFeelings } from './chatGpt'

console.log(process.env.APIKEY);
const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

app.post('/getFeeling', getFeelings)

app.listen(PORT, () => {
  console.log("Server running in port", PORT)
})