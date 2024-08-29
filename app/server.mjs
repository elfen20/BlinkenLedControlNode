// server.js
/**
 * @type {import('path')}
 * @type {import('config')}
 * @type {import('fastify').FastifyInstance}
 */

import path from 'node:path';
import config from 'config';
const serverCfg = config.has('server') ? config.server : { host: '0.0.0.0', port: 8888};
import log from './lib/logger.mjs';
log.info('- - - - Logging started - - - - - - - - - - - - - - - - - - - -');

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import Handlebars from 'handlebars';

import blinkenLedList from './lib/blinkenledlist.mjs';
import udpServer from './lib/udpserver.mjs';

//const redis = require('./lib/redis');

log.debug('pre-init done');

const fastify = Fastify({logger: {level: 'warn', }});

// register static rendering
fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, 'www_static'),
});

// register view rendering
fastify.register(fastifyView, {
  engine: {
    handlebars: Handlebars,
  },
  root: path.join(import.meta.dirname, 'www_view'),
  layout: path.join('layout', 'layout.hbs'),
})



fastify.get('/log', async (request, reply) => {
  // sample = await redis.client.json.get('sample_restaurant:10');
  sample = "123"
  return reply.viewAsync('log.hbs', { logItems: [], sample: JSON.stringify(sample)});
})

fastify.get('/scan', async (request, reply) => {
  udpServer.server.sendCommand('224.0.0.237', 'HELO');
  return reply.send({ result: 'Ok'});
})

fastify.get('/bled/:bledId', async (request, reply) => {
  const bledIp = blinkenLedList.getItemIp(request.params.bledId);
  const response = await fetch(`http://${bledIp}/info`).catch((error) => logger.error(error));
  const info = await response.text();
  return reply.viewAsync('bled.hbs', { bledIp: bledIp, info: JSON.stringify(info, null, '  ') });
})

fastify.get('/update/:bledId', async (request, reply) => {
  blinkenLedList.updateBLed(request.params.bledId);
  return reply.send({ result: 'Ok'});
})


fastify.get('/', async (request, reply) => {
  const blItems = blinkenLedList.getItemsJson();
  log.info(JSON.stringify(blItems));
  return reply.viewAsync('index.hbs', { blItems: blinkenLedList.getItemsJson() });
})

// run the server on 0.0.0.0:8888
const startServer = async () => {
  try {
    await fastify.listen(serverCfg)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// sending Helo
log.info('Sending Multicast Helo...');
await udpServer.sendCommand('224.0.0.237', 'HELO');

log.info('starting fastify web server...');
startServer()
