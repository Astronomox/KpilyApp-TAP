import { z } from "zod";
import { taskGoalSchema } from "./common";

// Shared task status, inferred from the lifecycle endpoints
// (assign -> accept -> submit -> review -> complete). The API
// doc doesn't hand us an enum for this directly, so this is our
// own derived shape, tighten it once /get-task confirms field names.
export const TaskStatus = {
  UNASSIGNED: "unassigned",
  ASSIGNED: "assigned",
  ACCEPTED: "accepted",
  SUBMITTED: "submitted",
  IN_REVIEW: "in_review",
  COMPLETED: "completed",
} as const;

export const taskStatusSchema = z.enum([
  TaskStatus.UNASSIGNED,
  TaskStatus.ASSIGNED,
  TaskStatus.ACCEPTED,
  TaskStatus.SUBMITTED,
  TaskStatus.IN_REVIEW,
  TaskStatus.COMPLETED,
]);

// POST /v1/org/create-task (multipart form-data)
export const createTaskFormSchema = z.object({
  name: z.string().min(1),
  details: z.string().min(1),
  dueDate: z.coerce.number().int().positive(), // unix timestamp
  goal: taskGoalSchema,
  assignee: z.string().email().optional(),
  reward: z.coerce.number().int().nonnegative(),
  // files handled separately as FormData.append, not part of the
  // zod-validated JSON slice of the payload
});
export type CreateTaskForm = z.infer<typeof createTaskFormSchema>;

// PUT /v1/org/update-task extends create-task with an id
export const updateTaskFormSchema = createTaskFormSchema.extend({
  id: z.string().min(1),
});
export type UpdateTaskForm = z.infer<typeof updateTaskFormSchema>;

// PUT /v1/org/submit-task, /accept-task, /complete-task all take just a taskID
export const taskIdRequestSchema = z.object({
  data: z.object({
    taskID: z.string().min(1),
  }),
});
export type TaskIdRequest = z.infer<typeof taskIdRequestSchema>;

// PUT /v1/org/review-task (multipart form-data)
export const reviewTaskFormSchema = z.object({
  taskID: z.string().min(1),
  message: z.string().min(1),
  // rawFiles handled as FormData, optional attachment
});
export type ReviewTaskForm = z.infer<typeof reviewTaskFormSchema>;

// POST /v1/org/assign-task
export const assignTaskRequestSchema = z.object({
  data: z.object({
    taskID: z.string().min(1),
    assignee: z.string().email(),
  }),
});
export type AssignTaskRequest = z.infer<typeof assignTaskRequestSchema>;

// POST /v1/org/submit-comment
export const submitCommentRequestSchema = z.object({
  data: z.object({
    taskID: z.string().min(1),
    comment: z.string().min(1),
  }),
});
export type SubmitCommentRequest = z.infer<typeof submitCommentRequestSchema>;

// GET /v1/org/get-task/{id} content shape
export const taskContentSchema = z.object({
  id: z.string(),
  name: z.string(),
  details: z.string(),
  dueDate: z.number().int(),
  goal: taskGoalSchema,
  assignee: z.string().email().nullable(),
  reward: z.number().int(),
  status: taskStatusSchema.optional(),
  fileUrls: z.array(z.string().url()).optional(),
});
export type TaskContent = z.infer<typeof taskContentSchema>;

// POST /v1/org/get-task (list/filter body, shape inferred, tighten on real response)
export const getTaskListRequestSchema = z.object({
  data: z.object({
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().optional(),
    status: taskStatusSchema.optional(),
    assignee: z.string().optional(),
  }),
});
export type GetTaskListRequest = z.infer<typeof getTaskListRequestSchema>;
