import { z } from 'zod';

export const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required').max(50, 'Task name too long'),
  description: z.string().max(200, 'Description too long').optional(),
  image: z.string().optional().or(z.literal('')),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  is_completed: z.boolean().optional(),
  due_date: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(val)) return false;
        const date = new Date(val);
        return (
          date instanceof Date && !isNaN(date.getTime()) && date.toISOString().split('T')[0] === val
        );
      },
      {
        message: 'Due date must be in YYYY-MM-DD format and a valid date',
      }
    ),
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
