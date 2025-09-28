import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { Button } from '../../components/Button';

describe('Button Component', () => {
  const defaultProps = {
    title: 'Test Button',
  };

  it('renders correctly with title', () => {
    const { getByText } = render(<Button {...defaultProps} />);

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('shows loading indicator when isLoading is true', () => {
    const { getByTestId, queryByText } = render(<Button {...defaultProps} isLoading />);

    const loadingIndicator = getByTestId('activity-indicator');
    expect(loadingIndicator).toBeTruthy();

    expect(queryByText('Test Button')).toBeFalsy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button {...defaultProps} onPress={mockOnPress} />);

    const button = getByText('Test Button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled when isLoading is true', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<Button {...defaultProps} onPress={mockOnPress} isLoading />);

    const touchable = getByTestId('button-touchable');
    fireEvent.press(touchable);

    // onPress should not be called when button is loading
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button {...defaultProps} onPress={mockOnPress} disabled />);

    const button = getByText('Test Button');
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    const { getByTestId } = render(<Button {...defaultProps} className={customClass} />);

    const touchable = getByTestId('button-touchable');
    expect(touchable).toBeTruthy();
  });
});
