import { IHistorical, IHistoricals } from '../alpha-vantage/historical.types';
import firebase from './firebase';

const BATCH_SIZE = 100;

interface IFirestoreHistorical extends IHistorical {
  symbol: string;
  timestamp: number;
  interval: string;
}

type IInterval = 'daily' | 'weekly' | 'monthly';

class Logger {
  constructor(private name: string) { }

  public log(...parameter) {
    console.log(`${this.name}:`, ...arguments);
  }

  public warn(...parameter) {
    console.log(`${this.name}:`, ...parameter);
  }

  public info(...parameter) {
    console.log(`${this.name}:`, ...parameter);
  }
}

const logger = new Logger('Firebase Historical');

/**
 * Updates firestore with data from alpha vantage.
 */
export async function saveToFirestore(
  symbol: string,
  interval: IInterval,
  alphaVantageData: IHistoricals,
) {
  let trackingTimestamp = 0;
  // check last update timestamp
  const lastUpdatedTimestamp = await getLastUpdatedTimestamp(symbol, interval);
  logger.log('last updated', lastUpdatedTimestamp);
  const timestamps = Object.keys(alphaVantageData)
    .map((timestamp) => new Date(timestamp).getTime())
    .sort((a, b) => a - b);
  const timestampStrings = timestamps.map((timestamp) => new Date(timestamp).toISOString());

  let promises: Array<Promise<any>> = [];
  for (let index = 0; index < timestamps.length; index++) {
    const timestamp = timestamps[index];
    if (timestamp > lastUpdatedTimestamp) {
      const promise = idempotentlyAdd({
        ...alphaVantageData[timestampStrings[index]],
        interval,
        symbol,
        timestamp,
      }, interval);

      promises.push(promise);
      if (promises.length === BATCH_SIZE) {
        logger.log(`processing ${BATCH_SIZE} (${promises.length})`);
        await Promise.all(promises);
        logger.log(`processed ${BATCH_SIZE} (${promises.length})`);
        promises = [];
      }
    }
    if (timestamp > trackingTimestamp) {
      trackingTimestamp = timestamp;
    }
  }
  await Promise.all(promises);
  await setLastUpdatedTimestamp(symbol, interval, trackingTimestamp);
}

function setLastUpdatedTimestamp(symbol: string, interval: IInterval, timestamp: number) {
  logger.log(`updating last updated: ${timestamp}`);
  return firebase.firestore().collection('updateHistories')
    .where('symbol', '==', symbol)
    .where('interval', '==', interval)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        firebase.firestore().collection('updateHistories').doc().create({
          interval,
          symbol,
          timestamp,
        });
      } else {
        querySnapshot.docs[0].ref.set({
          timestamp,
        });
      }
    });

}
function getLastUpdatedTimestamp(symbol: string, interval: IInterval) {
  return firebase.firestore().collection('updateHistories')
    .where('symbol', '==', symbol)
    .where('interval', '==', interval)
    .get()
    .then((querySnapshot) => {
      let lastUpdated: number;
      if (querySnapshot.size === 0) {
        lastUpdated = 0;
      } else {
        lastUpdated = querySnapshot.docs[0].data().timestamp;
      }
      return lastUpdated;
    });
}

/**
 * Idempotently adds a new entry to database
 */
async function idempotentlyAdd(data: IFirestoreHistorical, interval) {
  const existing = await getHistorical(data.symbol, interval, data.timestamp);
  if (!existing) {
    await firebase.firestore().collection(`${interval}Historicals`)
      .doc()
      .set(data);
    logger.log(`added ${interval}Historicals @ ${new Date(data.timestamp).toISOString()}`);
  } else {
    logger.log(`didn't add ${interval}Historicals @ ${new Date(data.timestamp).toISOString()}`);
  }
}

function getHistorical(symbol: string, interval: string, timestamp: number) {
  return firebase.firestore().collection(`${interval}Historicals`)
    .where('symbol', '==', symbol)
    .where('timestamp', '==', timestamp)
    .get()
    .then((querySnapshot) => querySnapshot.docs[0]);
}
