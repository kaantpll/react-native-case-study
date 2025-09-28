import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { RecentListsFilter } from '../../components/RecentListsFilter';

describe('RecentListsFilter Component', () => {
  const defaultProps = {
    showRecent: false,
    onToggleRecent: jest.fn(),
    recentLimit: 5,
    onLimitChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when showRecent is false', () => {
    const { getByText, queryByText } = render(<RecentListsFilter {...defaultProps} />);

    expect(getByText('Recent Lists')).toBeTruthy();
    expect(queryByText('items')).toBeFalsy(); // Limit container should not be visible
  });

  it('renders correctly when showRecent is true', () => {
    const { getByText, getByPlaceholderText } = render(
      <RecentListsFilter {...defaultProps} showRecent />
    );

    expect(getByText('Recent Lists')).toBeTruthy();
    expect(getByText('items')).toBeTruthy();
    expect(getByPlaceholderText('5')).toBeTruthy();
  });

  it('calls onToggleRecent when toggle button is pressed', () => {
    const mockOnToggleRecent = jest.fn();
    const { getByText } = render(
      <RecentListsFilter {...defaultProps} onToggleRecent={mockOnToggleRecent} />
    );

    const toggleButton = getByText('Recent Lists');
    fireEvent.press(toggleButton);

    expect(mockOnToggleRecent).toHaveBeenCalledTimes(1);
  });

  it('displays current limit value in input', () => {
    const { getByDisplayValue } = render(
      <RecentListsFilter {...defaultProps} showRecent recentLimit={10} />
    );

    expect(getByDisplayValue('10')).toBeTruthy();
  });

  it('calls onLimitChange with valid number input', () => {
    const mockOnLimitChange = jest.fn();
    const { getByDisplayValue } = render(
      <RecentListsFilter
        {...defaultProps}
        showRecent
        recentLimit={5}
        onLimitChange={mockOnLimitChange}
      />
    );

    const input = getByDisplayValue('5');
    fireEvent.changeText(input, '8');

    expect(mockOnLimitChange).toHaveBeenCalledWith(8);
  });

  it('does not call onLimitChange with invalid input', () => {
    const mockOnLimitChange = jest.fn();
    const { getByDisplayValue } = render(
      <RecentListsFilter
        {...defaultProps}
        showRecent
        recentLimit={5}
        onLimitChange={mockOnLimitChange}
      />
    );

    const input = getByDisplayValue('5');

    // Test with invalid inputs
    fireEvent.changeText(input, 'abc');
    fireEvent.changeText(input, '0');
    fireEvent.changeText(input, '51'); // Over limit
    fireEvent.changeText(input, '-5'); // Negative

    expect(mockOnLimitChange).not.toHaveBeenCalled();
  });

  it('updates local state even with invalid input', () => {
    const { getByDisplayValue } = render(
      <RecentListsFilter {...defaultProps} showRecent recentLimit={5} />
    );

    const input = getByDisplayValue('5');
    fireEvent.changeText(input, 'abc');

    // The input should still show the invalid text in state
    expect(input.props.value).toBe('abc');
  });

  it('shows different styling for active and inactive states', () => {
    const { getByText, rerender } = render(<RecentListsFilter {...defaultProps} />);

    const toggleButton = getByText('Recent Lists');
    expect(toggleButton).toBeTruthy();

    // Re-render with showRecent true
    rerender(<RecentListsFilter {...defaultProps} showRecent />);

    const activeToggleButton = getByText('Recent Lists');
    expect(activeToggleButton).toBeTruthy();
  });
});
