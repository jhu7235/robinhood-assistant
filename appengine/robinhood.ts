import fs from "fs";
import Robinhood, { RobinhoodWebApi } from "robinhood";

function _getCredentials() {
  const data = fs.readFileSync("credentials.json", "utf8");
  return JSON.parse(data);
}

/**
 * Logs user into robinhood. Must happen before using library
 * returns logged in app and logged in data
 */
export const sendCredentials = async () => {
  let robinhood;
  await new Promise((resolve) => {
    robinhood = Robinhood(_getCredentials(), resolve);
  });
  return robinhood;
};
