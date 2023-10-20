import { z } from 'zod';

export const SignupDto = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  avatar: z.string().min(2).max(255).optional(),
  age: z.string().min(2).max(255),
  Visits: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6),
  otp: z.string().min(6).optional(),
});

export type SignupDtoType = z.infer<typeof SignupDto>;

export const UserSignupDto = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  avatar: z.string().min(2).max(255).optional(),
  age: z.string().min(2).max(255),
  Visits: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6),
});

export type UserSignupDtoType = z.infer<typeof UserSignupDto>;

export const updateDto = z.object({
  firstName: z.string().min(2).max(255).optional(),
  lastName: z.string().min(2).max(255).optional(),
  avatar: z.string().min(2).max(255).optional(),
  age: z.string().min(2).max(255).optional(),
  Visits: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});
export type updateDtoType = z.infer<typeof updateDto>;

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
