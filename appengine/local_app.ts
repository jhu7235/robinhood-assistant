
/**
 * Able to run continuously on local machine
 */

import { async } from "./helpers";
import { sendCredentials } from "./robinhood";

async function start() {
  const robinhood = await sendCredentials();
  const earnings = await async(robinhood.earnings);
  console.log(earnings);
}

start();
