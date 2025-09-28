import { formatDate } from '../../utils/helper';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('formats a valid date string correctly', () => {
      const dateString = '1999-09-28T10:30:00Z';
      const result = formatDate(dateString);

      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}$/);
    });

    it('returns null for null input', () => {
      const result = formatDate(null);
      expect(result).toBeNull();
    });

    it('returns null for empty string input', () => {
      const result = formatDate('');
      expect(result).toBeNull();
    });

    it('formats different months correctly', () => {
      const january = '1999-01-15T10:30:00Z';
      const december = '1999-12-31T10:30:00Z';

      const januaryResult = formatDate(january);
      const decemberResult = formatDate(december);

      expect(januaryResult).toBe('Jan 15');
      expect(decemberResult).toBe('Dec 31');
    });

    it('handles single digit days correctly', () => {
      const singleDigitDay = '1999-03-05T10:30:00Z';
      const result = formatDate(singleDigitDay);

      expect(result).toBe('Mar 5');
    });

    it('handles different date formats', () => {
      const isoDate = '1999-02-10';
      const result = formatDate(isoDate);

      expect(result).toBe('Feb 10');
    });
  });
});
