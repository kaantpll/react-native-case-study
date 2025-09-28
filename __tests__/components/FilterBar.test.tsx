import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { FilterBar } from '../../components/FilterBar';

describe('FilterBar Component', () => {
  const defaultProps = {
    filterType: 'all' as const,
    onFilterChange: jest.fn(),
    showFilters: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all filter buttons', () => {
    const { getByText } = render(<FilterBar {...defaultProps} />);

    expect(getByText('All')).toBeTruthy();
    expect(getByText('Pending')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
    expect(getByText('Upcoming')).toBeTruthy();
    expect(getByText('High Priority')).toBeTruthy();
  });

  it('shows correct active filter button', () => {
    const { getByText } = render(<FilterBar {...defaultProps} filterType="pending" />);

    const pendingButton = getByText('Pending');
    expect(pendingButton).toBeTruthy();
  });

  it('calls onFilterChange when All button is pressed', () => {
    const mockOnFilterChange = jest.fn();
    const { getByText } = render(
      <FilterBar {...defaultProps} onFilterChange={mockOnFilterChange} />
    );

    const allButton = getByText('All');
    fireEvent.press(allButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('all');
  });

  it('calls onFilterChange when Pending button is pressed', () => {
    const mockOnFilterChange = jest.fn();
    const { getByText } = render(
      <FilterBar {...defaultProps} onFilterChange={mockOnFilterChange} />
    );

    const pendingButton = getByText('Pending');
    fireEvent.press(pendingButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('pending');
  });

  it('calls onFilterChange when Completed button is pressed', () => {
    const mockOnFilterChange = jest.fn();
    const { getByText } = render(
      <FilterBar {...defaultProps} onFilterChange={mockOnFilterChange} />
    );

    const completedButton = getByText('Completed');
    fireEvent.press(completedButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('completed');
  });

  it('calls onFilterChange when Upcoming button is pressed', () => {
    const mockOnFilterChange = jest.fn();
    const { getByText } = render(
      <FilterBar {...defaultProps} onFilterChange={mockOnFilterChange} />
    );

    const upcomingButton = getByText('Upcoming');
    fireEvent.press(upcomingButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('upcoming');
  });

  it('calls onFilterChange when High Priority button is pressed', () => {
    const mockOnFilterChange = jest.fn();
    const { getByText } = render(
      <FilterBar {...defaultProps} onFilterChange={mockOnFilterChange} />
    );

    const highPriorityButton = getByText('High Priority');
    fireEvent.press(highPriorityButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('high');
  });

  it('renders with different active filter types', () => {
    const filterTypes = ['all', 'pending', 'completed', 'upcoming', 'high'] as const;

    filterTypes.forEach((filterType) => {
      const { getByText } = render(<FilterBar {...defaultProps} filterType={filterType} />);

      expect(getByText('All')).toBeTruthy();
      expect(getByText('Pending')).toBeTruthy();
      expect(getByText('Completed')).toBeTruthy();
      expect(getByText('Upcoming')).toBeTruthy();
      expect(getByText('High Priority')).toBeTruthy();
    });
  });
});
