import { 
  convertCurrency, 
  convertMultipleCurrencies, 
  EXCHANGE_RATES 
} from '@/lib/utils/currency';

describe('Currency Utilities', () => {
  describe('convertCurrency', () => {
    it('should return the same amount when converting to the same currency', () => {
      const amountInUSD = 100;
      const result = convertCurrency(amountInUSD, 'USD', 'USD');
      
      expect(result).toBe(100);
    });

    it('should convert USD to CLP using the correct exchange rate', () => {
      const amountInUSD = 100;
      const expectedCLP = amountInUSD * EXCHANGE_RATES.CLP;
      
      const result = convertCurrency(amountInUSD, 'USD', 'CLP');
      
      expect(result).toBe(expectedCLP);
      expect(result).toBe(95000); // 100 USD * 950 CLP
    });

    it('should convert CLP to USD using the inverse exchange rate', () => {
      const amountInCLP = 95000;
      const expectedUSD = amountInCLP / EXCHANGE_RATES.CLP;
      
      const result = convertCurrency(amountInCLP, 'CLP', 'USD');
      
      expect(result).toBe(expectedUSD);
      expect(result).toBe(100); // 95000 CLP / 950
    });

    it('should convert EUR to GBP through USD as intermediate currency', () => {
      const amountInEUR = 100;
      
      // EUR -> USD -> GBP
      const amountInUSD = amountInEUR / EXCHANGE_RATES.EUR;
      const expectedGBP = amountInUSD * EXCHANGE_RATES.GBP;
      
      const result = convertCurrency(amountInEUR, 'EUR', 'GBP');
      
      expect(result).toBeCloseTo(expectedGBP, 2);
    });

    it('should handle zero amounts correctly', () => {
      const result = convertCurrency(0, 'USD', 'CLP');
      
      expect(result).toBe(0);
    });

    it('should handle decimal amounts with precision', () => {
      const amountInUSD = 9.99;
      const expectedCLP = amountInUSD * EXCHANGE_RATES.CLP;
      
      const result = convertCurrency(amountInUSD, 'USD', 'CLP');
      
      expect(result).toBeCloseTo(expectedCLP, 2);
      expect(result).toBeCloseTo(9490.5, 1);
    });
  });

  describe('convertMultipleCurrencies', () => {
    it('should sum multiple subscriptions in different currencies and convert to target currency', () => {
      const subscriptions = [
        { amount: 10, currency: 'USD' },    // Netflix in USD
        { amount: 5000, currency: 'CLP' },  // Spotify in CLP
        { amount: 5, currency: 'EUR' },     // Adobe in EUR
      ];

      const totalInUSD = convertMultipleCurrencies(subscriptions, 'USD');

      // Expected: 10 + (5000/950) + (5/0.92) = 10 + 5.26 + 5.43 = ~20.69
      expect(totalInUSD).toBeCloseTo(20.69, 1);
    });

    it('should return zero when converting an empty array', () => {
      const result = convertMultipleCurrencies([], 'USD');
      
      expect(result).toBe(0);
    });

    it('should handle all amounts in the same currency as the target', () => {
      const subscriptions = [
        { amount: 100, currency: 'USD' },
        { amount: 50, currency: 'USD' },
        { amount: 25, currency: 'USD' },
      ];

      const result = convertMultipleCurrencies(subscriptions, 'USD');

      expect(result).toBe(175);
    });

    it('should convert a mixed portfolio of Latin American currencies to CLP', () => {
      const subscriptions = [
        { amount: 10, currency: 'USD' },     // $10 USD
        { amount: 200, currency: 'MXN' },    // 200 Mexican Pesos
        { amount: 50000, currency: 'COP' },  // 50,000 Colombian Pesos
      ];

      const totalInCLP = convertMultipleCurrencies(subscriptions, 'CLP');

      // Expected calculation through USD:
      // 10 USD = 9,500 CLP
      // 200 MXN = (200/17.5) USD * 950 = 10,857 CLP
      // 50,000 COP = (50,000/4000) USD * 950 = 11,875 CLP
      // Total = ~32,232 CLP
      expect(totalInCLP).toBeCloseTo(32232, 0);
    });
  });
});
