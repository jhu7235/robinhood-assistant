const MINUTE = 1000 * 60;
export const FIVE_MINUTES = 5 * MINUTE;

const HOUR = MINUTE * 60;
export const FOUR_HOURS = 4 * HOUR;
export const TWENTY_FOUR_HOURS = 24 * HOUR;
export const FORTY_EIGHT_HOURS = 48 * HOUR;

export const ONE_DAY = TWENTY_FOUR_HOURS;
export const ONE_WEEK = 7 * ONE_DAY;
export const ONE_YEAR = 365 * ONE_DAY;
export const TEN_YEAR = 365 * ONE_DAY;

export type ICachedResponse<T> = T & { localCacheTime: number };
