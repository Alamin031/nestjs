import { z } from 'zod';

export const domainDto = z.object({
  name: z.string().min(2).max(255),
});

export type domainDtoType = z.infer<typeof domainDto>;
