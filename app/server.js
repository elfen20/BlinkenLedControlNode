// server.js
/**
 * @type {import('fastify').FastifyInstance}
 */

const fastify = require('fastify')({ logger: { level: 'warn' } })
const path = require('path')

// register root path
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'www'),
})

// run the server on 0.0.0.0:8888
const startServer = async () => {
  try {
    await fastify.listen({ port: 8888, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
startServer()
