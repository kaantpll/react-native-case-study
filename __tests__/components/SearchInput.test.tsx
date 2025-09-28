import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { SearchInput } from '../../components/SearchInput';

describe('SearchInput Component', () => {
  const defaultProps = {
    value: '',
    onChangeText: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = render(<SearchInput {...defaultProps} />);

    expect(getByPlaceholderText('Search lists...')).toBeTruthy();
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Custom placeholder';
    const { getByPlaceholderText } = render(
      <SearchInput {...defaultProps} placeholder={customPlaceholder} />
    );

    expect(getByPlaceholderText(customPlaceholder)).toBeTruthy();
  });

  it('displays the current value', () => {
    const testValue = 'test search';
    const { getByDisplayValue } = render(<SearchInput {...defaultProps} value={testValue} />);

    expect(getByDisplayValue(testValue)).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchInput {...defaultProps} onChangeText={mockOnChangeText} />
    );

    const input = getByPlaceholderText('Search lists...');
    fireEvent.changeText(input, 'new text');

    expect(mockOnChangeText).toHaveBeenCalledWith('new text');
  });

  it('shows clear button when there is text', () => {
    const { getByText } = render(<SearchInput {...defaultProps} value="test" />);

    const clearButton = getByText('✕');
    expect(clearButton).toBeTruthy();
  });

  it('does not show clear button when text is empty', () => {
    const { queryByText } = render(<SearchInput {...defaultProps} value="" />);

    const clearButton = queryByText('✕');
    expect(clearButton).toBeFalsy();
  });

  it('clears text when clear button is pressed', () => {
    const mockOnChangeText = jest.fn();
    const { getByText } = render(
      <SearchInput {...defaultProps} value="test text" onChangeText={mockOnChangeText} />
    );

    const clearButton = getByText('✕');
    fireEvent.press(clearButton);

    expect(mockOnChangeText).toHaveBeenCalledWith('');
  });

  it('calls onClearSearch when clear button is pressed', () => {
    const mockOnClearSearch = jest.fn();
    const mockOnChangeText = jest.fn();
    const { getByText } = render(
      <SearchInput
        {...defaultProps}
        value="test text"
        onChangeText={mockOnChangeText}
        onClearSearch={mockOnClearSearch}
      />
    );

    const clearButton = getByText('✕');
    fireEvent.press(clearButton);

    expect(mockOnClearSearch).toHaveBeenCalledTimes(1);
    expect(mockOnChangeText).toHaveBeenCalledWith('');
  });
});
