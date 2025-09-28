import { render } from '@testing-library/react-native';
import React from 'react';

import { Loading } from '../../components/Loading';

describe('Loading Component', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Loading testID="loading-component" />);

    expect(getByTestId('loading-component')).toBeTruthy();
  });

  it('renders with custom size', () => {
    const { getByTestId } = render(<Loading size="small" testID="loading-small" />);

    const loadingComponent = getByTestId('loading-small');
    expect(loadingComponent).toBeTruthy();
  });

  it('renders with custom color', () => {
    const customColor = '#ff0000';
    const { getByTestId } = render(<Loading color={customColor} testID="loading-red" />);

    const loadingComponent = getByTestId('loading-red');
    expect(loadingComponent).toBeTruthy();
  });

  it('applies custom className', () => {
    const customClass = 'custom-loading-class';
    const { getByTestId } = render(<Loading className={customClass} testID="loading-custom" />);

    const loadingComponent = getByTestId('loading-custom');
    expect(loadingComponent).toBeTruthy();
  });

  it('renders with both custom size and color', () => {
    const { getByTestId } = render(
      <Loading size="large" color="#00ff00" testID="loading-large-green" />
    );

    const loadingComponent = getByTestId('loading-large-green');
    expect(loadingComponent).toBeTruthy();
  });
});
