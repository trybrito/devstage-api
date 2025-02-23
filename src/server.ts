import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { accessInviteLinkRoute } from './routes/access-invite-link.routes'
import { getSubscriberInviteClicksRoute } from './routes/get-subscriber-invite-clicks.routes'
import { subscribeToEventRoute } from './routes/subscribe-to-event.routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()
const PORT = env.PORT

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: true, // here we add our production front-end url
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'NLW Connect API',
      version: '0.0.1',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(subscribeToEventRoute)
app.register(accessInviteLinkRoute)
app.register(getSubscriberInviteClicksRoute)

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`Server is running at: http://localhost:${PORT}`)
  })
