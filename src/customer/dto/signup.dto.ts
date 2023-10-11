import { z } from 'zod';

export const SignupDto = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignupDtoType = z.infer<typeof SignupDto>;

export const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type loginDtoType = z.infer<typeof loginDto>;

export const updateProfileDto = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6),
});

export type updateProfileDtoType = z.infer<typeof updateProfileDto>;

export const user1dto = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6),
});

export type user1dtoType = z.infer<typeof user1dto>;

export const SendOtpDto = z.object({
  email: z.string().email(),
});

export type SendOtpDtoType = z.infer<typeof SendOtpDto>;

export const registerDto = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6),
  otp: z.string().min(6),
});

export type registerDtoType = z.infer<typeof registerDto>;
