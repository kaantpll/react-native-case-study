import { render } from '@testing-library/react-native';
import React from 'react';

import { TasksStats } from '../../components/TasksStats';

describe('TasksStats Component', () => {
  const defaultProps = {
    totalTasks: 10,
    completedTasks: 3,
    pendingTasks: 7,
    filterType: 'all',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<TasksStats {...defaultProps} />);

    expect(getByText('10 tasks')).toBeTruthy();
    expect(getByText('3 completed')).toBeTruthy();
    expect(getByText('7 pending')).toBeTruthy();
  });

  it('shows correct text when filterType is all', () => {
    const { getByText } = render(<TasksStats {...defaultProps} filterType="all" />);

    expect(getByText('10 tasks')).toBeTruthy();
  });

  it('shows correct text when filterType is pending', () => {
    const { getByText } = render(<TasksStats {...defaultProps} filterType="pending" />);

    expect(getByText('10 pending')).toBeTruthy();
  });

  it('shows correct text when filterType is completed', () => {
    const { getByText } = render(<TasksStats {...defaultProps} filterType="completed" />);

    expect(getByText('10 completed')).toBeTruthy();
  });

  it('shows correct text when filterType is upcoming', () => {
    const { getByText } = render(<TasksStats {...defaultProps} filterType="upcoming" />);

    expect(getByText('10 upcoming')).toBeTruthy();
  });

  it('renders with zero values', () => {
    const { getByText } = render(
      <TasksStats totalTasks={0} completedTasks={0} pendingTasks={0} filterType="all" />
    );

    expect(getByText('0 tasks')).toBeTruthy();
    expect(getByText('0 completed')).toBeTruthy();
    expect(getByText('0 pending')).toBeTruthy();
  });

  it('renders with different numbers', () => {
    const { getByText } = render(
      <TasksStats totalTasks={25} completedTasks={15} pendingTasks={10} filterType="all" />
    );

    expect(getByText('25 tasks')).toBeTruthy();
    expect(getByText('15 completed')).toBeTruthy();
    expect(getByText('10 pending')).toBeTruthy();
  });

  it('renders completed and pending stats regardless of filter type', () => {
    const { getByText } = render(<TasksStats {...defaultProps} filterType="high" />);

    expect(getByText('10 high')).toBeTruthy();
    expect(getByText('3 completed')).toBeTruthy();
    expect(getByText('7 pending')).toBeTruthy();
  });
});
