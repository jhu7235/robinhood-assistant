export const ONE_MINUTE = 1000 * 60;
export const FIVE_MINUTES = 5 * ONE_MINUTE;

export const ONE_HOUR = ONE_MINUTE * 60;
export const FOUR_HOURS = 4 * ONE_HOUR;
export const TWENTY_FOUR_HOURS = 24 * ONE_HOUR;
export const FORTY_EIGHT_HOURS = 48 * ONE_HOUR;

export const ONE_DAY = TWENTY_FOUR_HOURS;
export const ONE_MONTH = 30 * ONE_DAY;
export const ONE_WEEK = 7 * ONE_DAY;
export const ONE_YEAR = 365 * ONE_DAY;
export const TEN_YEAR = 365 * ONE_DAY;

export type ICachedResponse<T> = T & { localCacheTime: number };
