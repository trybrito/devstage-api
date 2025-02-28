import { redis } from '../redis/client'

interface GetSubscriberInvitesCount {
  subscriberId: string
}

export async function getSubscriberInvitesCount({
  subscriberId,
}: GetSubscriberInvitesCount) {
  const count = await redis.zscore('referral:ranking', subscriberId)

  return { count: count ? Number.parseInt(count) : 0 }
}
