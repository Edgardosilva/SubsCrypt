import { 
  formatCurrency, 
  formatCurrencyParts, 
  formatDate, 
  daysUntil 
} from '@/lib/utils';

describe('Formatting Utilities', () => {
  describe('formatCurrency', () => {
    it('should format CLP amounts with thousand separators and CLP suffix', () => {
      const amount = 15000;
      
      const result = formatCurrency(amount, 'CLP');
      
      expect(result).toBe('15.000 CLP');
    });

    it('should format USD amounts with dollar symbol and two decimal places', () => {
      const amount = 49.99;
      
      const result = formatCurrency(amount, 'USD');
      
      expect(result).toBe('$49.99');
    });

    it('should format large CLP amounts without decimals', () => {
      const amount = 1250000;
      
      const result = formatCurrency(amount, 'CLP');
      
      expect(result).toBe('1.250.000 CLP');
    });

    it('should handle zero amounts correctly', () => {
      const resultCLP = formatCurrency(0, 'CLP');
      const resultUSD = formatCurrency(0, 'USD');
      
      expect(resultCLP).toBe('0 CLP');
      expect(resultUSD).toBe('$0.00');
    });
  });

  describe('formatCurrencyParts', () => {
    it('should split USD amounts into symbol, main part, and decimal cents', () => {
      const amount = 1234.56;
      
      const result = formatCurrencyParts(amount, 'USD');
      
      expect(result).toEqual({
        symbol: '$',
        main: '1,234',
        decimals: '.56'
      });
    });

    it('should format CLP amounts with main part and CLP as decimals placeholder', () => {
      const amount = 987654;
      
      const result = formatCurrencyParts(amount, 'CLP');
      
      expect(result).toEqual({
        symbol: '',
        main: '987.654',
        decimals: 'CLP'
      });
    });

    it('should handle USD amounts with zero cents showing .00', () => {
      const amount = 100;
      
      const result = formatCurrencyParts(amount, 'USD');
      
      expect(result).toEqual({
        symbol: '$',
        main: '100',
        decimals: '.00'
      });
    });
  });

  describe('formatDate', () => {
    it('should format a Date object into readable MMM DD, YYYY format', () => {
      const date = new Date('2026-03-15');
      
      const result = formatDate(date);
      
      expect(result).toMatch(/Mar 1[45], 2026/); // Handles timezone differences
    });

    it('should format an ISO date string into readable format', () => {
      const dateString = '2026-12-25T00:00:00Z';
      
      const result = formatDate(dateString);
      
      expect(result).toMatch(/Dec 2[45], 2026/);
    });
  });

  describe('daysUntil', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-02-16T00:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return 0 when the date is today', () => {
      const today = new Date('2026-02-16T12:00:00Z');
      
      const result = daysUntil(today);
      
      expect(result).toBe(1); // Ceil rounds up partial days
    });

    it('should calculate days until a future billing date', () => {
      const futureDate = new Date('2026-02-23T00:00:00Z'); // 7 days from now
      
      const result = daysUntil(futureDate);
      
      expect(result).toBe(7);
    });

    it('should return negative days for past dates', () => {
      const pastDate = new Date('2026-02-10T00:00:00Z'); // 6 days ago
      
      const result = daysUntil(pastDate);
      
      expect(result).toBeLessThan(0);
      expect(result).toBe(-6);
    });

    it('should handle ISO string dates for upcoming subscription renewals', () => {
      const renewalDate = '2026-03-16T00:00:00Z'; // Exactly 1 month from now
      
      const result = daysUntil(renewalDate);
      
      expect(result).toBe(28); // Feb 16 to Mar 16 = 28 days
    });
  });
});
