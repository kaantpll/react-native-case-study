import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { TasksList } from '../../../components/task/TasksList';
import { Task } from '../../../types';

jest.mock('../../../components/EmptyState', () => ({
  EmptyState: ({ title, description }: { title: string; description?: string }) => {
    const React = require('react');
    const { Text, View } = require('react-native');
    return (
      <View>
        <Text>{title}</Text>
        {description && <Text>{description}</Text>}
      </View>
    );
  },
}));

jest.mock('../../../components/Loading', () => ({
  Loading: () => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text>Loading...</Text>;
  },
}));

jest.mock('../../../components/task/TaskCard', () => ({
  TaskCard: ({ task }: { task: Task }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text>TaskCard: {task.name}</Text>;
  },
}));

describe('TasksList Component', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      name: 'First Task',
      description: 'First task description',
      image: null,
      status: 'pending',
      priority: 'high',
      is_completed: false,
      due_date: '2024-12-31',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      list_id: 1,
    },
    {
      id: 2,
      name: 'Second Task',
      description: 'Second task description',
      image: null,
      status: 'in_progress',
      priority: 'medium',
      is_completed: false,
      due_date: '2024-11-30',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      list_id: 1,
    },
  ];

  const defaultProps = {
    tasks: mockTasks,
    refetch: jest.fn(),
    isSearching: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with tasks', () => {
    const { getByText } = render(<TasksList {...defaultProps} />);

    expect(getByText('TaskCard: First Task')).toBeTruthy();
    expect(getByText('TaskCard: Second Task')).toBeTruthy();
  });

  it('renders loading when isSearching is true', () => {
    const { getByText, queryByText } = render(<TasksList {...defaultProps} isSearching />);

    expect(getByText('Loading...')).toBeTruthy();
    expect(queryByText('TaskCard: First Task')).toBeFalsy();
  });

  it('renders empty state when no tasks', () => {
    const { getByText } = render(<TasksList {...defaultProps} tasks={[]} />);

    expect(getByText('No tasks yet')).toBeTruthy();
    expect(getByText('Create your first task to get started')).toBeTruthy();
  });

  it('calls refetch when pull to refresh is triggered', () => {
    const mockRefetch = jest.fn();
    const { UNSAFE_getByType } = render(<TasksList {...defaultProps} refetch={mockRefetch} />);

    const RefreshControl = require('react-native').RefreshControl;
    const refreshControl = UNSAFE_getByType(RefreshControl);

    // Simulate pull to refresh
    fireEvent(refreshControl, 'onRefresh');

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('renders with single task', () => {
    const singleTask = [mockTasks[0]];
    const { getByText, queryByText } = render(<TasksList {...defaultProps} tasks={singleTask} />);

    expect(getByText('TaskCard: First Task')).toBeTruthy();
    expect(queryByText('TaskCard: Second Task')).toBeFalsy();
  });

  it('does not render empty state when isSearching is true even with no tasks', () => {
    const { getByText, queryByText } = render(
      <TasksList {...defaultProps} tasks={[]} isSearching />
    );

    expect(getByText('Loading...')).toBeTruthy();
    expect(queryByText('No tasks yet')).toBeFalsy();
  });

  it('handles refresh control properly', () => {
    const { UNSAFE_getByType } = render(<TasksList {...defaultProps} />);

    const FlatList = require('react-native').FlatList;
    const flatList = UNSAFE_getByType(FlatList);

    expect(flatList.props.refreshControl).toBeTruthy();
    expect(flatList.props.showsVerticalScrollIndicator).toBe(false);
    expect(flatList.props.contentContainerStyle).toEqual({ paddingBottom: 20 });
  });

  it('uses correct keyExtractor', () => {
    const { UNSAFE_getByType } = render(<TasksList {...defaultProps} />);

    const FlatList = require('react-native').FlatList;
    const flatList = UNSAFE_getByType(FlatList);

    const keyExtractor = flatList.props.keyExtractor;
    expect(keyExtractor(mockTasks[0])).toBe('1');
    expect(keyExtractor(mockTasks[1])).toBe('2');
  });

  it('handles empty tasks array correctly', () => {
    const { getByText } = render(<TasksList {...defaultProps} tasks={[]} />);

    expect(getByText('No tasks yet')).toBeTruthy();
    expect(getByText('Create your first task to get started')).toBeTruthy();
  });

  it('renders FlatList with correct props', () => {
    const { UNSAFE_getByType } = render(<TasksList {...defaultProps} />);

    const FlatList = require('react-native').FlatList;
    const flatList = UNSAFE_getByType(FlatList);

    expect(flatList.props.data).toEqual(mockTasks);
    expect(typeof flatList.props.renderItem).toBe('function');
    expect(typeof flatList.props.keyExtractor).toBe('function');
  });
});
