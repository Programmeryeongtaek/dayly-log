import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(6, "비밀번호는 6자 이상이어야 합니다."),
});

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(6, "비밀번호는 6자 이상이어야 합니다."),
  name: z
    .string()
    .min(1, "이름을 입력해주세요.")
    .min(2, "이름은 2자 이상이어야 합니다."),
  nickname: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 2,
      "닉네임은 2자 이상이어야 합니다.",
    ),
});

export const profileUpdateSchema = z.object({
  nickname: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 2,
      "닉네임은 2자 이상이어야 합니다.",
    ),
  avatar_url: z.string().url("올바른 URL을 입력해주세요.").optional(),
});

// 타입 추출
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;
