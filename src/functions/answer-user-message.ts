import { generateText, tool } from 'ai'
import z from 'zod'
import { openai } from '../ai/openai'
import { db, postgres } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscriptions'
import { postgresTool } from '../tools/postgres-tool'

interface AnswerUserMessageParams {
  message: string
}

export async function answerUserMessage({ message }: AnswerUserMessageParams) {
  const answer = await generateText({
    model: openai,
    prompt: message,
    tools: {
      postgresTool,
    },
    system: `
      Você é um assistente de IA responsável por responder dúvidas sobre um evento de programação.

      Inclua na resposta somente o que o usuário pediu, sem nenhum texto adicional.

      O retorno deve sempre ser em markdown (sem incluir \`\`\` no início ou no fim).
    `.trim(),
    maxSteps: 5,
  })

  return { response: answer.text }
}
