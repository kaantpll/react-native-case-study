import {
  listSchema,
  listUpdateSchema,
  taskSchema,
  taskUpdateSchema,
} from '../../utils/validations';

describe('Validation Schemas', () => {
  describe('taskSchema', () => {
    it('validates valid task data', () => {
      const validTask = {
        name: 'Test Task',
        description: 'Task description',
        status: 'pending' as const,
        priority: 'high' as const,
        is_completed: false,
        due_date: '2024-12-31',
        list_id: 1,
      };

      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('fails validation when name is empty', () => {
      const invalidTask = {
        name: '',
        list_id: 1,
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Task name is required');
      }
    });

    it('fails validation when name is too long', () => {
      const invalidTask = {
        name: 'a'.repeat(51),
        list_id: 1,
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Task name too long');
      }
    });

    it('fails validation when description is too long', () => {
      const invalidTask = {
        name: 'Valid Task',
        description: 'a'.repeat(201),
        list_id: 1,
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description too long');
      }
    });

    it('fails validation with invalid date format', () => {
      const invalidTask = {
        name: 'Test Task',
        due_date: '31-12-2024', // Invalid format
        list_id: 1,
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Due date must be in YYYY-MM-DD format and a valid date'
        );
      }
    });

    it('validates with empty due_date', () => {
      const validTask = {
        name: 'Test Task',
        due_date: '',
        list_id: 1,
      };

      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('fails validation with invalid status', () => {
      const invalidTask = {
        name: 'Test Task',
        status: 'invalid_status',
        list_id: 1,
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('fails validation with invalid priority', () => {
      const invalidTask = {
        name: 'Test Task',
        priority: 'invalid_priority',
        list_id: 1,
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('fails validation when list_id is not positive', () => {
      const invalidTask = {
        name: 'Test Task',
        list_id: 0,
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('List ID must be positive');
      }
    });
  });

  describe('listSchema', () => {
    it('validates valid list data', () => {
      const validList = {
        name: 'Test List',
      };

      const result = listSchema.safeParse(validList);
      expect(result.success).toBe(true);
    });

    it('fails validation when name is empty', () => {
      const invalidList = {
        name: '',
      };

      const result = listSchema.safeParse(invalidList);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('List name is required');
      }
    });

    it('fails validation when name is too long', () => {
      const invalidList = {
        name: 'a'.repeat(51),
      };

      const result = listSchema.safeParse(invalidList);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('List name too long');
      }
    });
  });

  describe('taskUpdateSchema', () => {
    it('validates partial task updates', () => {
      const partialUpdate = {
        name: 'Updated Task Name',
        is_completed: true,
      };

      const result = taskUpdateSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('validates empty update object', () => {
      const emptyUpdate = {};

      const result = taskUpdateSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe('listUpdateSchema', () => {
    it('validates partial list updates', () => {
      const partialUpdate = {
        name: 'Updated List Name',
      };

      const result = listUpdateSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('validates empty update object', () => {
      const emptyUpdate = {};

      const result = listUpdateSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });
  });
});
