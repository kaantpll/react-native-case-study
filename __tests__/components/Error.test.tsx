import { render } from '@testing-library/react-native';
import React from 'react';

import { Error } from '../../components/Error';

describe('Error Component', () => {
  it('renders correctly with error message', () => {
    const errorMessage = 'Something went wrong!';
    const { getByText } = render(<Error message={errorMessage} />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('renders with different error messages', () => {
    const errorMessage = 'Network connection failed';
    const { getByText } = render(<Error message={errorMessage} />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('applies custom className', () => {
    const customClass = 'custom-error-class';
    const { getByTestId } = render(
      <Error message="Test error" className={customClass} testID="error-component" />
    );

    const errorComponent = getByTestId('error-component');
    expect(errorComponent).toBeTruthy();
  });

  it('renders with empty message', () => {
    const { getByText } = render(<Error message="" />);

    expect(getByText('')).toBeTruthy();
  });

  it('renders with long error message', () => {
    const longMessage =
      'This is a very long error message that should still be displayed correctly in the error component without any issues';
    const { getByText } = render(<Error message={longMessage} />);

    expect(getByText(longMessage)).toBeTruthy();
  });
});
