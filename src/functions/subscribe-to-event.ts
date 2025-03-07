import { eq } from 'drizzle-orm'
import { db } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscriptions'
import { redis } from '../redis/client'

interface SubscribeToEventParams {
  name: string
  email: string
  referrer?: string | null
}

export async function subscribeToEvent({
  name,
  email,
  referrer,
}: SubscribeToEventParams) {
  const subscribers = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, email))

  if (subscribers.length > 0) {
    return { subscriberId: subscribers[0].id }
  }

  const [subscriber] = await db
    .insert(subscriptions)
    .values({
      name,
      email,
    })
    .returning()

  if (referrer) {
    await redis.zincrby('referral:ranking', 1, referrer)
    const rank = await redis.zrevrank('referral:ranking', referrer)
    console.log(rank)
  }

  return {
    subscriberId: subscriber.id,
  }
}
