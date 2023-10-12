import { z } from 'zod';

// const permissionSchema = z.object({
//   type: z.string(),
// });

// export const AdminSignupDto = z.object({
//   name: z.string().min(2).max(255),
//   email: z.string().email(),
//   password: z.string().min(6),
//   permissions: z.array(
//     z.object({
//       type: z.string(),
//     }),
//   ),
// });
export const AdminSignupDto = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6),
  permissions: z.array(z.object({ type: z.string() })),
});

export type adminSignupDtoType = z.infer<typeof AdminSignupDto>;

//login dto
export const AdminLoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type adminLoginDtoType = z.infer<typeof AdminLoginDto>;
