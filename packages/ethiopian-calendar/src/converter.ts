import { EthiopianDate, GregorianDate, DateConversion } from './types';

// Ethiopian calendar constants
const ETHIOPIAN_EPOCH = 1723856; // Julian day number of 1 Meskerem 1
const GREGORIAN_EPOCH = 1721426; // Julian day number of 1 January 1 AD

export class EthiopianCalendarConverter {
  /**
   * Convert Ethiopian date to Gregorian date
   */
  static toGregorian(ethiopianDate: EthiopianDate): GregorianDate {
    const jd = this.ethiopianToJdn(ethiopianDate);
    return this.jdnToGregorian(jd);
  }

  /**
   * Convert Gregorian date to Ethiopian date
   */
  static toEthiopian(gregorianDate: GregorianDate): EthiopianDate {
    const jd = this.gregorianToJdn(gregorianDate);
    return this.jdnToEthiopian(jd);
  }

  /**
   * Convert Ethiopian date to Julian day number
   */
  private static ethiopianToJdn(ethiopianDate: EthiopianDate): number {
    const { year, month, day } = ethiopianDate;
    
    return (
      ETHIOPIAN_EPOCH +
      365 * (year - 1) +
      Math.floor(year / 4) +
      30 * (month - 1) +
      day - 1
    );
  }

  /**
   * Convert Julian day number to Ethiopian date
   */
  private static jdnToEthiopian(jd: number): EthiopianDate {
    const year = Math.floor((jd - ETHIOPIAN_EPOCH) / 365.25) + 1;
    const yearStart = ETHIOPIAN_EPOCH + 365 * (year - 1) + Math.floor(year / 4);
    const dayOfYear = jd - yearStart;
    
    let month = Math.floor(dayOfYear / 30) + 1;
    let day = (dayOfYear % 30) + 1;
    
    // Handle Pagume (13th month)
    if (month > 12) {
      month = 13;
      day = dayOfYear - (12 * 30) + 1;
    }
    
    return { year, month, day };
  }

  /**
   * Convert Gregorian date to Julian day number
   */
  private static gregorianToJdn(gregorianDate: GregorianDate): number {
    const { year, month, day } = gregorianDate;
    
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    return (
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045
    );
  }

  /**
   * Convert Julian day number to Gregorian date
   */
  private static jdnToGregorian(jd: number): GregorianDate {
    const a = jd + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);
    
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = 100 * b + d - 4800 + Math.floor(m / 10);
    
    return { year, month, day };
  }

  /**
   * Get current date in both Ethiopian and Gregorian calendars
   */
  static getCurrentDate(): DateConversion {
    const gregorian = new Date();
    const gregorianDate: GregorianDate = {
      year: gregorian.getFullYear(),
      month: gregorian.getMonth() + 1,
      day: gregorian.getDate(),
    };
    
    const ethiopianDate = this.toEthiopian(gregorianDate);
    
    return {
      ethiopian: ethiopianDate,
      gregorian: gregorianDate,
    };
  }

  /**
   * Format Ethiopian date as string
   */
  static formatEthiopianDate(ethiopianDate: EthiopianDate): string {
    const monthNames = [
      'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
    ];
    
    const monthName = monthNames[ethiopianDate.month - 1];
    return `${monthName} ${ethiopianDate.day}, ${ethiopianDate.year}`;
  }

  /**
   * Check if a year is a leap year in the Ethiopian calendar
   */
  static isLeapYear(year: number): boolean {
    return year % 4 === 3 || year % 4 === -1;
  }
}