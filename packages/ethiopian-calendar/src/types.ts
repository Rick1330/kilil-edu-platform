export interface EthiopianDate {
  year: number;
  month: number; // 1-13 (13 is Pagume)
  day: number;   // 1-30 (1-5 for Pagume)
}

export interface GregorianDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

export interface DateConversion {
  ethiopian: EthiopianDate;
  gregorian: GregorianDate;
}

export interface CalendarConstants {
  ETHIOPIAN_EPOCH: number;
  GREGORIAN_EPOCH: number;
  MONTHS_IN_YEAR: number;
  DAYS_IN_MONTH: number;
  PAGUME_DAYS: number;
}