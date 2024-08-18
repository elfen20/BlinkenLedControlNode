// server.js
/**
 * @type {import('fastify').FastifyInstance}
 * @type {import('config')}
 */
const path = require('path');
const config = require('config');
const { logger } = require('./lib/logger');
const udpserver = require('./lib/udpserver');
const { blinkenLedList } = require('./lib/blinkenledlist');

logger.info('App started!');

const fastify = require('fastify')({logger: {level: 'warn', }})

// register static rendering
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'www_static'),
})

// register view rendering
fastify.register(require('@fastify/view'), {
  engine: {
    handlebars: require('handlebars'),
  },
  root: path.join(__dirname, 'www_view'),
  layout: path.join('layout', 'layout.hbs'),
})

fastify.get('/log', async (request, reply) => {
  return reply.viewAsync('log.hbs', { logItems:  []});
})

fastify.get('/scan', async (request, reply) => {
  udpserver.server.sendCommand('224.0.0.237', 'HELO');
  return reply.send({ result: 'Ok'});
})

fastify.get('/bled/:bledId', async (request, reply) => {
  const bledInfo = { id: request.params.bledId}
  return reply.viewAsync('bled.hbs', { bledInfo: bledInfo });
})

fastify.get('/', async (request, reply) => {
  const blItems = blinkenLedList.getItemsJson();
  logger.info(JSON.stringify(blItems));
  return reply.viewAsync('index.hbs', { blItems: blinkenLedList.getItemsJson() });
})

// run the server on 0.0.0.0:8888
const serverCfg = config.has('server') ? config.server : { host: '0.0.0.0', port: 8888};
const startServer = async () => {
  try {
    await fastify.listen(serverCfg)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// sending Helo
logger.info('Sending Mulicast Helo..');
udpserver.server.sendCommand('224.0.0.237', 'HELO');

logger.info('Starting Webserver...');
startServer()
