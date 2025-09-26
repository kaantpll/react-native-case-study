import { z } from 'zod';

export const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required').max(100, 'Task name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  image: z.string().optional().or(z.literal('')),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  is_completed: z.boolean().optional(),
  due_date: z.string().optional().or(z.literal('')),
  list_id: z.number().int().positive('List ID must be positive'),
});

export const listSchema = z.object({
  name: z.string().min(1, 'List name is required').max(50, 'List name too long'),
});

export const taskUpdateSchema = taskSchema.partial().omit({ list_id: true });

export const listUpdateSchema = listSchema.partial();

export type TaskInput = z.infer<typeof taskSchema>;
export type ListInput = z.infer<typeof listSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
export type ListUpdateInput = z.infer<typeof listUpdateSchema>;
