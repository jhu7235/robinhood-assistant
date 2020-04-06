import fs from "fs";
import Robinhood, { RobinhoodWebApi } from "robinhood";
import robinhood from "robinhood";
import { async } from "./helpers";

let _robinhood;

function _getCredentials() {
  const data = fs.readFileSync("credentials.json", "utf8");
  return JSON.parse(data);
}

/**
 * Logs user into robinhood. Must happen before using library
 * returns logged in app and logged in data
 */
export const sendCredentials = async () => {
  await new Promise((resolve) => {
    _robinhood = Robinhood(_getCredentials(), resolve);
  });
  return _robinhood;
};

interface IRobinhoodPositionResponse {
  next: string;
  previous: string;
  results: IRobinhoodPosition[];
}

interface IRobinhoodPosition {
  url: string;
  instrument: string; // url
  account: string;
  account_number: string;
  average_buy_price: string;
  pending_average_buy_price: string;
  quantity: string;
  intraday_average_buy_price: string;
  intraday_quantity: string;
  shares_held_for_buys: string;
  shares_held_for_sells: string;
  shares_held_for_stock_grants: string;
  shares_held_for_options_collateral: string;
  shares_held_for_options_events: string;
  shares_pending_from_options_events: string;
  updated_at: string; // timestamp
  created_at: string; // timestamp
}

interface IPosition {
  symbol: string;
  average_buy_price: string;
  updated_at: string; // timestamp
  created_at: string; // timestamp
  quantity: string;
}

export const getPositions = async () => {
  const positions: IRobinhoodPositionResponse = await async(_robinhood.positions);
  const promises = positions.results.map(async (position): Promise<IPosition> => {
    const instrument = await async(_robinhood.url, position.instrument);
    const splits = await async(_robinhood.url, instrument.splits);
    console.log({...splits, symbol: instrument.symbol});
    return {
      average_buy_price: position.average_buy_price,
      created_at: position.created_at,
      quantity: position.quantity,
      symbol: instrument.symbol,
      updated_at: position.updated_at,
    };
  });
  return await Promise.all(promises);
};
