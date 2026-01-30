import { z } from 'zod';

export function zodErrorToMessage(err: z.ZodError) {
  return err.issues.map((i) => `${i.path.join('.') || 'field'}: ${i.message}`).join('; ');
}
