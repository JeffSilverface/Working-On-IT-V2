import { z } from 'zod';

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string().refine(isValidUrl, { message: 'Invalid URL' }),
});

export type Env = z.infer<typeof envSchema>;
