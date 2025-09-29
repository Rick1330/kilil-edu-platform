import { EthiopianDate, GregorianDate } from './types';
import { EthiopianCalendarConverter } from './converter';

/**
 * Utility functions for working with Ethiopian calendar
 */
export class EthiopianCalendarUtils {
  /**
   * Get the number of days in a given Ethiopian month
   */
  static getDaysInMonth(year: number, month: number): number {
    if (month >= 1 && month <= 12) {
      return 30; // First 12 months have 30 days each
    } else if (month === 13) {
      // Pagume (13th month) has 5 or 6 days depending on leap year
      return EthiopianCalendarConverter.isLeapYear(year) ? 6 : 5;
    }
    throw new Error(`Invalid month: ${month}`);
  }

  /**
   * Validate Ethiopian date
   */
  static isValidEthiopianDate(date: EthiopianDate): boolean {
    if (date.year < 1) return false;
    if (date.month < 1 || date.month > 13) return false;
    
    const maxDays = this.getDaysInMonth(date.year, date.month);
    return date.day >= 1 && date.day <= maxDays;
  }

  /**
   * Get month name in Amharic
   */
  static getMonthName(month: number): string {
    const monthNames = [
      'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
    ];
    
    if (month < 1 || month > 13) {
      throw new Error(`Invalid month: ${month}`);
    }
    
    return monthNames[month - 1];
  }

  /**
   * Get month name in English
   */
  static getMonthNameEn(month: number): string {
    const monthNames = [
      'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
      'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
    ];
    
    if (month < 1 || month > 13) {
      throw new Error(`Invalid month: ${month}`);
    }
    
    return monthNames[month - 1];
  }

  /**
   * Add days to an Ethiopian date
   */
  static addDays(ethiopianDate: EthiopianDate, days: number): EthiopianDate {
    const jd = EthiopianCalendarConverter['ethiopianToJdn'](ethiopianDate);
    const newJd = jd + days;
    return EthiopianCalendarConverter['jdnToEthiopian'](newJd);
  }

  /**
   * Calculate difference between two Ethiopian dates in days
   */
  static diffInDays(date1: EthiopianDate, date2: EthiopianDate): number {
    const jd1 = EthiopianCalendarConverter['ethiopianToJdn'](date1);
    const jd2 = EthiopianCalendarConverter['ethiopianToJdn'](date2);
    return Math.abs(jd1 - jd2);
  }

  /**
   * Check if a date is a holiday
   */
  static isHoliday(ethiopianDate: EthiopianDate): boolean {
    // Fixed holidays (same day every year)
    const fixedHolidays = [
      { month: 1, day: 1 },   // Ethiopian New Year
      { month: 1, day: 11 },  // Meskel
      { month: 4, day: 11 },  // Adwa Victory Day
      { month: 6, day: 23 },  // Downfall of Derg
      { month: 10, day: 27 }, // Victory Day
    ];

    return fixedHolidays.some(holiday => 
      holiday.month === ethiopianDate.month && holiday.day === ethiopianDate.day
    );
  }

  /**
   * Get academic year for a given Ethiopian date
   */
  static getAcademicYear(ethiopianDate: EthiopianDate): number {
    // Academic year starts in September (Meskerem)
    if (ethiopianDate.month >= 1 && ethiopianDate.month <= 8) {
      // Current academic year (started previous year)
      return ethiopianDate.year;
    } else {
      // Next academic year (starts this year)
      return ethiopianDate.year - 1;
    }
  }

  /**
   * Get semester for a given Ethiopian date
   */
  static getSemester(ethiopianDate: EthiopianDate): 'I' | 'II' | 'Summer' {
    if (ethiopianDate.month >= 1 && ethiopianDate.month <= 5) {
      return 'II'; // Second semester (Tikimt - Miazia)
    } else if (ethiopianDate.month >= 6 && ethiopianDate.month <= 12) {
      return 'I'; // First semester (Ginbot - Nehase)
    } else {
      return 'Summer'; // Summer (Pagume)
    }
  }
}