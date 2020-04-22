'use strict';

// [START gae_node_request_example]
import cors from 'cors';
import express from 'express';
import alphaVantage, { IOutputSize } from './alpha-vantage/alpha-vantage';
import { IInterval, ISpan } from './robinhood/historicals.type';
import robinhood from './robinhood/robinhood';

const app = express();

// allows calls from all origins
// TODO: block origins
app.use(cors());

// TODO: make all paths auth protected and check that is logged into account

app.get('/user', async (req, res) => {
  try {
    console.log('get user');
    const user = await robinhood.getUser();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/quote/:symbol', async (req, res) => {
  try {
    console.log('get quote: ', req.params.symbol);
    const quote = await robinhood.getQuote(req.params.symbol);
    res.status(200).json(quote);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/accounts', async (req, res) => {
  try {
    console.log('get accounts');
    const accounts = await robinhood.getAccounts();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/instruments', async (req, res) => {
  try {
    console.log('get instruments');
    const instruments = await robinhood.getInstruments();
    res.status(200).json(instruments);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/historicals/daily/:symbol', async (req, res) => {
  try {
    console.log('get daily historicals', req.params.symbol);
    const historicals = await alphaVantage.getDaily(
      req.params.symbol as string,
      req.query.outputSize as IOutputSize,
    );
    res.status(200).json(historicals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/historicals/intraday/:symbol', async (req, res) => {
  try {
    console.log('get intraday historicals', req.params.symbol);
    const historicals = await robinhood.getHistoricals(
      req.params.symbol as string,
      req.query.interval as IInterval,
      req.query.span as ISpan,

    );
    res.status(200).json(historicals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/historicals/weekly/:symbol', async (req, res) => {
  try {
    console.log('get weekly historicals', req.params.symbol);
    const historicals = await alphaVantage.getWeekly(
      req.params.symbol as string,
      req.query.outputSize as IOutputSize,
    );
    res.status(200).json(historicals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/historicals/monthly/:symbol', async (req, res) => {
  try {
    console.log('get monthly historicals', req.params.symbol);
    const historicals = await alphaVantage.getMonthly(
      req.params.symbol as string,
      req.query.outputSize as IOutputSize,
    );
    res.status(200).json(historicals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/positions', async (req, res) => {
  try {
    console.log('get positions');
    const positions = await robinhood.getPositions();
    res.status(200).json(positions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/orders', async (req, res) => {
  try {
    console.log('get orders');
    const orders = await robinhood.getOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
