import { IHistorical, IHistoricals } from '../alpha-vantage/historical.types';
import { Logger } from '../Logger';
import { DAY, HOUR } from '../time.contant';
import firebase from './firebase';

const BATCH_SIZE = 100;

interface IFirestoreHistorical extends IHistorical {
  symbol: string;
  timestamp: number;
  interval: string;
}

type IInterval = 'daily' | 'weekly' | 'monthly';

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
  const timestamps = toSortedTimestamps(alphaVantageData);
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
      // process in batches to avoid crashes
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

function toSortedTimestamps(alphaVantageData: IHistoricals): number[] {
  return Object.keys(alphaVantageData)
    .map((timestamp) => new Date(timestamp).getTime())
    .sort((a, b) => a - b);
}

function setLastUpdatedTimestamp(symbol: string, interval: IInterval, timestamp: number) {
  return firebase.firestore()
    .collection('updateHistories')
    .doc(`${interval}-${symbol}`)
    .set({ timestamp });
}

async function getLastUpdatedTimestamp(symbol: string, interval: IInterval) {
  const updateHistory = await firebase.firestore()
    .collection('updateHistories')
    .doc(`${interval}-${symbol}`)
    .get();
  return updateHistory.exists ? updateHistory.data().timestamp : 0;
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

export async function saveToFirestore2(
  symbol: string,
  interval: IInterval,
  alphaVantageData: IHistoricals,
) {
  const lastUpdatedTimestamp: number = await getLastUpdatedTimestamp(symbol, interval);
  if (isExpired(lastUpdatedTimestamp, interval)) {
    logger.log(`saving ${interval} ${symbol} to firebase`);
    await firebase.firestore().collection(`${interval}Historicals`)
      .doc(symbol)
      .set(alphaVantageData);
    await setLastUpdatedTimestamp(symbol, interval, Date.now());
    logger.log(`saved ${interval} ${symbol} to firebase`);
  }
}

function isExpired(timestamp: number, interval: IInterval) {
  switch (interval) {
    case 'daily':
      return Date.now() - timestamp > 4 * HOUR;

    case 'weekly':
      return Date.now() - timestamp > 3 * DAY;

    case 'monthly':
      return Date.now() - timestamp > 7 * DAY;

    default:
      throw new Error('invalid interval');
  }
}
