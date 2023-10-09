import { z } from 'zod';

export const SignupDto = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignupDtoType = z.infer<typeof SignupDto>;
