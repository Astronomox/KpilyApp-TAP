import { z } from 'zod'

// ---------- API ----------

/** Every KPILY response: { result: { status, message, details }, content }. */
export const envelopeSchema = z.object({
  result: z.object({
    status: z.number(),
    message: z.string().nullish(),
    details: z.unknown().optional(),
  }),
  content: z.unknown().optional(),
})

export const profileSchema = z.looseObject({
  fullname: z.string(),
  email: z.string(),
  privilege: z.number(),
  point: z.number().catch(0),
})

export const sessionSchema = z.object({
  token: z.string().min(1),
  profile: profileSchema,
  redirectToPlanPage: z.boolean().optional(),
})

// ---------- Forms ----------

const email = z.email('Enter a valid email address.')
const required = (label: string) => z.string().trim().min(1, `${label} is required.`)

/** Password rules used by registration and resets. */
export const newPassword = z.string()
  .min(8, 'Use at least 8 characters.')
  .regex(/[A-Z]/, 'Include an uppercase letter.')
  .regex(/[a-z]/, 'Include a lowercase letter.')
  .regex(/\d/, 'Include a number.')

export const loginSchema = z.object({ email, password: z.string().min(1, 'Enter your password.') })
export const emailSchema = z.object({ email })

export const resetSchema = z.object({ password: newPassword, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: 'The passwords do not match.', path: ['confirm'] })

export const changePasswordSchema = z.object({ current: z.string().min(1, 'Enter your current password.'), next: newPassword, confirm: z.string() })
  .refine((v) => v.next === v.confirm, { message: 'The new passwords do not match.', path: ['confirm'] })

export const onboardSchema = z.object({
  firstName: required('First name'),
  lastName: required('Last name'),
  gender: required('Gender'),
  phone: z.string().trim().regex(/^\+?[\d\s-]{7,16}$/, 'Enter a valid phone number.'),
  password: newPassword,
  companyName: z.string().trim().optional(),
})

export const profileFormSchema = z.object({
  fullname: required('Full name'),
  phone: z.string().trim().regex(/^(\+?[\d\s-]{6,16})?$/, 'Enter a valid phone number.'),
  gender: z.enum(['Male', 'Female']),
})

export const orgSchema = z.object({
  companyName: required('Company name'),
  companyWebsite: z.union([z.literal(''), z.url('Enter a full website address, e.g. https://example.com.')]),
  mailDomain: z.string().trim().regex(/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i, 'Enter a domain such as example.com.'),
  industry: z.string().trim(),
  country: z.string().trim(),
  state: z.string().trim(),
})

export const taskSchema = z.object({
  name: required('Task name'),
  details: required('Details'),
  assignee: z.email('Choose who the task is for.'),
  dueDate: z.date({ error: 'Choose a due date.' }).refine((d) => !Number.isNaN(d.getTime()), 'Choose a due date.'),
  reward: z.number().int('Points must be a whole number.').min(0, 'Points cannot be negative.'),
  goal: z.number().int().min(1, 'Goal must be at least 1.'),
})

export const eventSchema = z.object({
  name: required('Title'),
  start: z.date(),
  end: z.date(),
  onlineLocation: z.union([z.literal(''), z.url('Enter a full link, e.g. https://meet.example.com.')]),
}).refine((v) => v.end > v.start, { message: 'The end time must be after the start time.', path: ['end'] })

export const teamSchema = z.object({
  teamName: required('Team name'),
  teamLeader: z.email('Choose a team leader.'),
  reportsTo: z.email('Choose who the team reports to.'),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
})

export const inviteSchema = z.object({
  fullname: required('Full name'),
  email,
  privilege: z.number().int(),
  team: z.string().optional(),
  designation: z.string().trim().optional(),
})

/** Parses with a schema, throwing the first problem as a readable Error. */
export function check<T>(schema: z.ZodType<T>, value: unknown): T {
  const r = schema.safeParse(value)
  if (!r.success) throw new Error(r.error.issues[0]?.message || 'Please check the form.')
  return r.data
}
