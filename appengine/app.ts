'use strict';

// [START gae_node_request_example]
import express from 'express';
import { RobinhoodWebApi } from 'robinhood';
import { async } from './helpers';
import { getPositions, sendCredentials } from './robinhood';

const app = express();

let robinhood: RobinhoodWebApi;
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/user', async (req, res) => {
  console.log('get user');
  const user = await async(robinhood.user);
  res.status(200).json(user);
});

app.get('/instruments', async (req, res) => {
  console.log('get instruments');
  const instruments = await async(robinhood.instruments, null);
  res.status(200).json(instruments);
});

app.get('/positions', async (req, res) => {
  console.log('get positions');
  const positions = await getPositions();
  res.status(200).json(positions);
});

app.get('/orders', async (req, res) => {
  console.log('get orders');
  const orders = await async(robinhood.orders, null);
  res.status(200).json(orders);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  robinhood = await sendCredentials();
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// [END gae_node_request_example]

module.exports = app;
