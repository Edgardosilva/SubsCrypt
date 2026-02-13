import { z } from "zod";

export const createSubscriptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  logo: z.string().url().optional().or(z.literal("")),
  url: z.string().url().optional().or(z.literal("")),
  price: z.coerce.number().positive("Price must be positive"),
  currency: z.string().min(3).max(3).default("USD"),
  cycle: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL"]).default("MONTHLY"),
  billingDay: z.coerce.number().min(1).max(31).default(1),
  nextBilling: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  category: z
    .enum([
      "STREAMING",
      "GAMING",
      "MUSIC",
      "PRODUCTIVITY",
      "CLOUD_STORAGE",
      "EDUCATION",
      "FITNESS",
      "NEWS",
      "SOFTWARE",
      "OTHER",
    ])
    .default("OTHER"),
  status: z.enum(["ACTIVE", "PAUSED", "CANCELLED", "TRIAL"]).default("ACTIVE"),
  color: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
