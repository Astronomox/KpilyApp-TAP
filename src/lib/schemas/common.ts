import { z } from "zod";

/**
 * KPILY API status codes, taken directly from the docs.
 * Hex values kept as-is since that's how the API documents them.
 */
export const KpilyStatus = {
  COMPLETED: 0x00,
  USER_DOES_NOT_EXIST: 0x03,
  GENERIC_ERROR: 0x05,
  FILE_NOT_FOUND: 0x07,
  LOGIC_ERROR: 0x10,
  INPUT_ERROR: 0x11,
  CREATE_TASK_ERROR: 0x12, // documented as INVALID_REQUEST in the spec, kept distinct in case it diverges
  NO_ACTIVE_SUBSCRIPTION: 0x15,
  SYSTEM_ERROR: 0x20,
  ACCESS_DENIED_ERROR: 0x40,
} as const;

export const kpilyResultSchema = z.object({
  message: z.string(),
  status: z.number().int(),
  details: z.string().nullable(),
});

/**
 * Wraps a content schema in the standard KPILY envelope:
 * { result, content, statusCode }
 */
export function kpilyEnvelope<T extends z.ZodTypeAny>(contentSchema: T) {
  return z.object({
    result: kpilyResultSchema,
    content: contentSchema,
    statusCode: z.number().int().optional(),
  });
}

export type KpilyResult = z.infer<typeof kpilyResultSchema>;

/** Account type: 0 = Admin (platform), 1 = Organization */
export const accountTypeSchema = z.union([z.literal(0), z.literal(1)]);

/** Privilege levels, higher number = more access */
export const PrivilegeLevel = {
  SUPERADMIN: 200,
  ADMIN: 100,
  HR: 50,
  TEAM_LEAD: 40,
  UNIT_LEAD: 35,
  MEMBER: 30,
} as const;

export const privilegeSchema = z.union([
  z.literal(PrivilegeLevel.SUPERADMIN),
  z.literal(PrivilegeLevel.ADMIN),
  z.literal(PrivilegeLevel.HR),
  z.literal(PrivilegeLevel.TEAM_LEAD),
  z.literal(PrivilegeLevel.UNIT_LEAD),
  z.literal(PrivilegeLevel.MEMBER),
]);

/** Task lifecycle goal/recurrence type */
export const TaskGoal = {
  QUARTERLY: 1,
  MONTHLY: 2,
  YEARLY: 3,
} as const;

export const taskGoalSchema = z.union([
  z.literal(TaskGoal.QUARTERLY),
  z.literal(TaskGoal.MONTHLY),
  z.literal(TaskGoal.YEARLY),
]);
