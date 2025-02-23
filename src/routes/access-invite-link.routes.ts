import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from '../env'
import { accessInviteLink } from '../functions/access-invite-link'
import { redis } from '../redis/client'

export const accessInviteLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/invites/:subscriberId',
    {
      schema: {
        summary: 'Access invite link and redirects user',
        tags: ['referral'],
        params: z.object({
          subscriberId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { subscriberId } = request.params

      await accessInviteLink({ subscriberId })

      console.log(await redis.hgetall('referral:access-count'))

      const redirectUrl = new URL(env.WEB_URL)

      redirectUrl.searchParams.set('referrer', subscriberId)

      // 301 = redirect permanente (cacheado -> não é bom para quando queremos contabilizar algo a partir do acesso à URL)
      // 302 = redirect temporário (não cacheado);

      return reply.redirect(redirectUrl.toString(), 302)
    }
  )
}
