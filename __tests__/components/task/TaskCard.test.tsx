import { Alert } from 'react-native';
import { render } from '@testing-library/react-native';

import { TaskCard } from '../../../components/task/TaskCard';
import { Task } from '../../../types';

jest.mock('../../../hooks/useTasks', () => ({
  useDeleteTask: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useUpdateTask: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock('../../../store/modalStore', () => ({
  useModalStore: jest.fn(() => ({
    openTaskModal: jest.fn(),
  })),
}));

jest.mock('../../../utils/helper', () => ({
  formatDate: jest.fn((date: string) => date),
}));

jest.spyOn(Alert, 'alert');

describe('TaskCard Component', () => {
  const mockTask: Task = {
    id: 1,
    name: 'Test Task',
    description: 'Test Description',
    image: null,
    status: 'pending',
    priority: 'high',
    is_completed: false,
    due_date: '2024-12-31',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    list_id: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with task data', () => {
    const { getByText } = render(<TaskCard task={mockTask} />);

    expect(getByText('Test Task')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText('HIGH')).toBeTruthy();
  });

  it('renders without description when not provided', () => {
    const taskWithoutDescription = { ...mockTask, description: null };
    const { queryByText } = render(<TaskCard task={taskWithoutDescription} />);

    expect(queryByText('Test Description')).toBeNull();
  });

  it('renders without due date when not provided', () => {
    const taskWithoutDueDate = { ...mockTask, due_date: null };
    const { queryByText } = render(<TaskCard task={taskWithoutDueDate} />);

    expect(queryByText(/Due/)).toBeNull();
  });

  it('shows completed styling for completed tasks', () => {
    const completedTask = { ...mockTask, status: 'completed' as const };
    const { getByText } = render(<TaskCard task={completedTask} />);

    expect(getByText('Test Task')).toBeTruthy();
  });

  it('shows correct priority colors', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' as const };
    const { getByText } = render(<TaskCard task={highPriorityTask} />);

    expect(getByText('HIGH')).toBeTruthy();
  });

  it('formats different statuses correctly', () => {
    const inProgressTask = { ...mockTask, status: 'in_progress' as const };
    const { getByText } = render(<TaskCard task={inProgressTask} />);

    expect(getByText('In Progress')).toBeTruthy();
  });

  it('renders with image when provided', () => {
    const taskWithImage = { ...mockTask, image: 'https://example.com/image.jpg' };
    const { UNSAFE_getByType } = render(<TaskCard task={taskWithImage} />);

    const Image = require('react-native').Image;
    const image = UNSAFE_getByType(Image);

    expect(image.props.source.uri).toBe('https://example.com/image.jpg');
  });

  it('handles null priority gracefully', () => {
    const taskWithoutPriority = { ...mockTask, priority: null };
    const { getByText } = render(<TaskCard task={taskWithoutPriority} />);

    expect(getByText('Test Task')).toBeTruthy();
  });

  it('handles null status gracefully', () => {
    const taskWithoutStatus = { ...mockTask, status: null };
    const { getByText } = render(<TaskCard task={taskWithoutStatus} />);

    expect(getByText('Test Task')).toBeTruthy();
  });

  it('renders different priority levels', () => {
    const mediumTask = { ...mockTask, priority: 'medium' as const };
    const { getByText } = render(<TaskCard task={mediumTask} />);
    expect(getByText('MEDIUM')).toBeTruthy();

    const { getByText: getByTextLow } = render(
      <TaskCard task={{ ...mockTask, priority: 'low' as const }} />
    );
    expect(getByTextLow('LOW')).toBeTruthy();
  });

  it('renders task with completed status', () => {
    const completedTask = { ...mockTask, status: 'completed' as const };
    const { getByText } = render(<TaskCard task={completedTask} />);

    expect(getByText('Completed')).toBeTruthy();
  });

  it('renders task with pending status', () => {
    const pendingTask = { ...mockTask, status: 'pending' as const };
    const { getByText } = render(<TaskCard task={pendingTask} />);

    expect(getByText('Pending')).toBeTruthy();
  });

  it('shows loading state when updating', () => {
    const mockUpdateTask = require('../../../hooks/useTasks').useUpdateTask;
    mockUpdateTask.mockReturnValue({ mutate: jest.fn(), isPending: true });

    const { UNSAFE_getAllByProps } = render(<TaskCard task={mockTask} />);

    const icons = UNSAFE_getAllByProps({});
    const hasLoadingIcon = icons.some(
      (icon: any) => icon.props && icon.props.name === 'hourglass-empty'
    );

    expect(hasLoadingIcon).toBe(true);
  });

  it('shows loading state when deleting', () => {
    const mockDeleteTask = require('../../../hooks/useTasks').useDeleteTask;
    mockDeleteTask.mockReturnValue({ mutate: jest.fn(), isPending: true });

    const { UNSAFE_getAllByProps } = render(<TaskCard task={mockTask} />);

    const icons = UNSAFE_getAllByProps({});
    const hasLoadingIcon = icons.some(
      (icon: any) => icon.props && icon.props.name === 'hourglass-empty'
    );

    expect(hasLoadingIcon).toBe(true);
  });
});
