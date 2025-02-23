import { redis } from '../redis/client'

interface getSubscriberInviteClicks {
  subscriberId: string
}

export async function getSubscriberInviteClicks({
  subscriberId,
}: getSubscriberInviteClicks) {
  const count = await redis.hget('referral:access-count', subscriberId)

  return { count: count ? Number.parseInt(count) : 0 }
}
