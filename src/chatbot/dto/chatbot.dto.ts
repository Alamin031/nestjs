import { z } from 'zod';
export const CreateChatbotDto = z.object({
  name: z.string(),
  isGreetings: z.boolean(),
  greetingsSMS: z.string().optional(),
  icone: z.string(),
});

export type CreateChatbotDtoType = z.infer<typeof CreateChatbotDto>;
