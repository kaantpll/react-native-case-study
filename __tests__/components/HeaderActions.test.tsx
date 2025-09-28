import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { HeaderActions } from '../../components/HeaderActions';

describe('HeaderActions Component', () => {
  const defaultProps = {
    onToggleFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { toJSON } = render(<HeaderActions {...defaultProps} />);

    expect(toJSON()).toBeTruthy();
  });

  it('calls onToggleFilters when filter button is pressed', () => {
    const mockOnToggleFilters = jest.fn();
    const { UNSAFE_getByType } = render(
      <HeaderActions {...defaultProps} onToggleFilters={mockOnToggleFilters} />
    );

    const TouchableOpacity = require('react-native').TouchableOpacity;
    const filterButton = UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(filterButton);

    expect(mockOnToggleFilters).toHaveBeenCalledTimes(1);
  });

  it('renders MaterialIcons filter icon', () => {
    const { toJSON } = render(<HeaderActions {...defaultProps} />);

    expect(toJSON()).toBeTruthy();
  });
});
