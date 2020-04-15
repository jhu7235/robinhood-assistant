'use strict';

// [START gae_node_request_example]
import cors from 'cors';
import express from 'express';
import robinhood from './robinhood/robinhood';

const app = express();

// allows calls from all origins
// TODO: block origins
app.use(cors());

// TODO: make all paths auth protected and check that is logged into account
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/user', async (req, res) => {
  console.log('get user');
  const user = await robinhood.getUser();
  res.status(200).json(user);
});

app.get('/quote/:symbol', async (req, res) => {
  console.log('get quote: ', req.params.symbol);
  const quote = await robinhood.getQuote(req.params.symbol);
  res.status(200).json(quote);
});

app.get('/accounts', async (req, res) => {
  console.log('get accounts');
  const accounts = await robinhood.getAccounts();
  res.status(200).json(accounts);
});

app.get('/instruments', async (req, res) => {
  console.log('get instruments');
  const instruments = await robinhood.getInstruments();
  res.status(200).json(instruments);
});

app.get('/historicals', async (req, res) => {
  const historicals = await robinhood.getHistoricals(
    req.query.symbol as string,
    req.query.interval as string,
    req.query.span as string,
  );
  console.log(historicals);
  res.status(200).json(historicals);
});

app.get('/positions', async (req, res) => {
  console.log('get positions');
  const positions = await robinhood.getPositions();
  res.status(200).json(positions);
});

app.get('/orders', async (req, res) => {
  console.log('get orders');
  const orders = await robinhood.getOrders();
  res.status(200).json(orders);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  await robinhood.sendCredentials();
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// [END gae_node_request_example]

module.exports = app;
