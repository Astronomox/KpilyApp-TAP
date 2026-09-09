import { z } from "zod";
import { accountTypeSchema, privilegeSchema } from "./common";

// POST /v1/mail-verify
export const mailVerifyRequestSchema = z.object({
  data: z.object({
    email: z.string().email(),
  }),
});
export type MailVerifyRequest = z.infer<typeof mailVerifyRequestSchema>;

// GET /v1/mail-verify/{code} -> content shape is not documented beyond
// "prefill the appropriate fields", so we keep this loose but named,
// and tighten it once we see a real 200 response.
export const mailVerifyConfirmContentSchema = z.object({
  email: z.string().email().optional(),
  organizationName: z.string().optional(),
  invitedBy: z.string().optional(),
});
export type MailVerifyConfirmContent = z.infer<
  typeof mailVerifyConfirmContentSchema
>;

// POST /v1/auth (login)
export const authRequestSchema = z.object({
  data: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});
export type AuthRequest = z.infer<typeof authRequestSchema>;

export const authContentSchema = z.object({
  token: z.string(),
  type: accountTypeSchema,
  privilege: privilegeSchema,
  accountId: z.string(),
});
export type AuthContent = z.infer<typeof authContentSchema>;

// POST /v1/org/onboard (Company Info step, after mail-verify code is confirmed)
// Field set taken from the actual "Company Info" Figma frame, not the
// short version we first guessed from the API doc alone.
export const employeeBandSchema = z.enum(["0-20", "20-50", "50-100", "100+"]);

export const passwordRule = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[0-9]/, "One numeral")
  .regex(/[A-Z]/, "One uppercase letter");

export const onboardRequestSchema = z
  .object({
    data: z.object({
      code: z.string().min(1),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      company: z.string().min(1),
      workEmail: z.string().email(),
      employeeBand: employeeBandSchema,
      phoneCountryCode: z.string().min(1),
      phoneNumber: z.string().min(1),
      industry: z.string().min(1),
      country: z.string().min(1),
      state: z.string().min(1),
      password: passwordRule,
      confirmPassword: z.string(),
      agreedToTerms: z.literal(true),
      // companyLogo handled as FormData, not part of the JSON slice
    }),
  })
  .refine((val) => val.data.password === val.data.confirmPassword, {
    message: "Passwords must match",
    path: ["data", "confirmPassword"],
  });
export type OnboardRequest = z.infer<typeof onboardRequestSchema>;

// PUT /v1/update-profile
export const updateProfileRequestSchema = z.object({
  data: z.object({
    fullName: z.string().min(1).optional(),
    preferredName: z.string().optional(),
    email: z.string().email().optional(),
  }),
});
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;

// PUT /v1/update-password
export const updatePasswordRequestSchema = z.object({
  data: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  }),
});
export type UpdatePasswordRequest = z.infer<
  typeof updatePasswordRequestSchema
>;

// POST /v1/reset-password/1 (request reset code)
export const resetPasswordRequestSchema = z.object({
  data: z.object({
    email: z.string().email(),
  }),
});

// POST /v1/reset-password/2 (confirm code + set new password)
export const resetPasswordConfirmSchema = z.object({
  data: z.object({
    code: z.string(),
    newPassword: z.string().min(8),
  }),
});

// GET /v1/get-self, GET /v1/get-account/{id}
export const accountContentSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  preferredName: z.string().optional(),
  type: accountTypeSchema,
  privilege: privilegeSchema,
  photoUrl: z.string().url().nullable().optional(),
});
export type AccountContent = z.infer<typeof accountContentSchema>;

// POST /v1/invite-user
export const inviteUserRequestSchema = z.object({
  data: z.object({
    email: z.string().email(),
    team: z.string().optional(),
    privilege: privilegeSchema,
  }),
});
export type InviteUserRequest = z.infer<typeof inviteUserRequestSchema>;

// POST /v1/change-user-status
export const changeUserStatusRequestSchema = z.object({
  data: z.object({
    accountId: z.string(),
    active: z.boolean(),
  }),
});

// POST /v1/org/change-user-privilege
export const changeUserPrivilegeRequestSchema = z.object({
  data: z.object({
    accountId: z.string(),
    privilege: privilegeSchema,
  }),
});
