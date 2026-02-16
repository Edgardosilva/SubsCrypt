import { 
  createSubscriptionSchema, 
  updateSubscriptionSchema 
} from '@/lib/validators/subscription';

describe('Subscription Validation Schemas', () => {
  describe('createSubscriptionSchema', () => {
    it('should validate a complete valid subscription with all required fields', () => {
      const validSubscription = {
        name: 'Netflix',
        description: 'Streaming service for movies and series',
        price: 14.99,
        currency: 'USD',
        cycle: 'MONTHLY',
        category: 'STREAMING',
        status: 'ACTIVE',
      };

      const result = createSubscriptionSchema.safeParse(validSubscription);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Netflix');
        expect(result.data.price).toBe(14.99);
      }
    });

    it('should apply default values when optional fields are omitted', () => {
      const minimalSubscription = {
        name: 'Spotify',
        price: 9.99,
      };

      const result = createSubscriptionSchema.safeParse(minimalSubscription);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currency).toBe('USD');
        expect(result.data.cycle).toBe('MONTHLY');
        expect(result.data.category).toBe('OTHER');
        expect(result.data.status).toBe('ACTIVE');
        expect(result.data.billingDay).toBe(1);
      }
    });

    it('should reject subscription when name is empty', () => {
      const invalidSubscription = {
        name: '',
        price: 10,
      };

      const result = createSubscriptionSchema.safeParse(invalidSubscription);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is required');
      }
    });

    it('should reject subscription when price is zero or negative', () => {
      const subscriptionWithZeroPrice = {
        name: 'Free Service',
        price: 0,
      };

      const result = createSubscriptionSchema.safeParse(subscriptionWithZeroPrice);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Price must be positive');
      }
    });

    it('should validate all available subscription cycles', () => {
      const cycles = ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'];

      cycles.forEach(cycle => {
        const subscription = {
          name: 'Test Service',
          price: 10,
          cycle,
        };

        const result = createSubscriptionSchema.safeParse(subscription);
        expect(result.success).toBe(true);
      });
    });

    it('should validate all available subscription categories', () => {
      const categories = [
        'STREAMING',
        'GAMING',
        'MUSIC',
        'PRODUCTIVITY',
        'CLOUD_STORAGE',
        'EDUCATION',
        'FITNESS',
        'NEWS',
        'SOFTWARE',
        'OTHER',
      ];

      categories.forEach(category => {
        const subscription = {
          name: 'Test Service',
          price: 10,
          category,
        };

        const result = createSubscriptionSchema.safeParse(subscription);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid currency codes that are not exactly 3 characters', () => {
      const invalidCurrencies = ['US', 'USDD', ''];

      invalidCurrencies.forEach(currency => {
        const subscription = {
          name: 'Test Service',
          price: 10,
          currency,
        };

        const result = createSubscriptionSchema.safeParse(subscription);
        expect(result.success).toBe(false);
      });
    });

    it('should validate billing day is between 1 and 31', () => {
      const subscription = {
        name: 'Monthly Service',
        price: 15,
        billingDay: 15,
      };

      const result = createSubscriptionSchema.safeParse(subscription);
      expect(result.success).toBe(true);
    });

    it('should reject billing day outside the valid range', () => {
      const invalidBillingDay = {
        name: 'Service',
        price: 10,
        billingDay: 32,
      };

      const result = createSubscriptionSchema.safeParse(invalidBillingDay);
      expect(result.success).toBe(false);
    });
  });

  describe('updateSubscriptionSchema', () => {
    it('should allow partial updates with only the fields that changed', () => {
      const partialUpdate = {
        price: 19.99,
        status: 'PAUSED',
      };

      const result = updateSubscriptionSchema.safeParse(partialUpdate);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe(19.99);
        expect(result.data.status).toBe('PAUSED');
        expect(result.data.name).toBeUndefined();
      }
    });

    it('should validate an update with only the subscription name', () => {
      const nameUpdate = {
        name: 'Netflix Premium',
      };

      const result = updateSubscriptionSchema.safeParse(nameUpdate);

      expect(result.success).toBe(true);
    });

    it('should allow empty object for updates that do not change any fields', () => {
      const emptyUpdate = {};

      const result = updateSubscriptionSchema.safeParse(emptyUpdate);

      expect(result.success).toBe(true);
    });

    it('should still validate constraints on fields that are provided', () => {
      const invalidUpdate = {
        price: -10,
      };

      const result = updateSubscriptionSchema.safeParse(invalidUpdate);

      expect(result.success).toBe(false);
    });
  });
});
