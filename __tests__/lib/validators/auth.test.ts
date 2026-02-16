import { loginSchema, registerSchema } from '@/lib/validators/auth';

describe('Authentication Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct email and password combination', () => {
      const validLogin = {
        email: 'user@example.com',
        password: 'securePassword123',
      };

      const result = loginSchema.safeParse(validLogin);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('user@example.com');
        expect(result.data.password).toBe('securePassword123');
      }
    });

    it('should reject login when email format is invalid', () => {
      const invalidEmail = {
        email: 'not-an-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidEmail);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });

    it('should reject login when password is shorter than 6 characters', () => {
      const shortPassword = {
        email: 'user@example.com',
        password: '12345',
      };

      const result = loginSchema.safeParse(shortPassword);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
      }
    });

    it('should accept password that is exactly 6 characters long', () => {
      const minPasswordLength = {
        email: 'user@example.com',
        password: '123456',
      };

      const result = loginSchema.safeParse(minPasswordLength);

      expect(result.success).toBe(true);
    });
  });

  describe('registerSchema', () => {
    it('should validate complete registration with all required fields', () => {
      const validRegistration = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePass123',
        confirmPassword: 'securePass123',
      };

      const result = registerSchema.safeParse(validRegistration);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
        expect(result.data.email).toBe('john@example.com');
      }
    });

    it('should reject registration when passwords do not match', () => {
      const mismatchedPasswords = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        confirmPassword: 'differentPassword',
      };

      const result = registerSchema.safeParse(mismatchedPasswords);

      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find(
          issue => issue.path[0] === 'confirmPassword'
        );
        expect(confirmError?.message).toBe('Passwords do not match');
      }
    });

    it('should reject registration when name is too short', () => {
      const shortName = {
        name: 'J',
        email: 'user@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(shortName);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name must be at least 2 characters');
      }
    });

    it('should validate name that is exactly 2 characters long', () => {
      const minNameLength = {
        name: 'Ed',
        email: 'ed@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(minNameLength);

      expect(result.success).toBe(true);
    });

    it('should reject registration with invalid email format', () => {
      const invalidEmail = {
        name: 'John Doe',
        email: 'invalid-email-format',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(invalidEmail);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });

    it('should reject registration when password is too short', () => {
      const shortPassword = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345',
        confirmPassword: '12345',
      };

      const result = registerSchema.safeParse(shortPassword);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
      }
    });

    it('should reject registration when confirmPassword is missing', () => {
      const missingConfirmPassword = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = registerSchema.safeParse(missingConfirmPassword);

      expect(result.success).toBe(false);
    });
  });
});
