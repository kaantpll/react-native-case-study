import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { ScreenContent } from '../../components/ScreenContent';

jest.mock('../../components/EditScreenInfo', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    EditScreenInfo: ({ path }: { path: string }) => <Text>EditScreenInfo: {path}</Text>,
  };
});

describe('ScreenContent Component', () => {
  const defaultProps = {
    title: 'Test Screen',
    path: '/test-path',
  };

  it('renders correctly with title and path', () => {
    const { getByText } = render(<ScreenContent {...defaultProps} />);

    expect(getByText('Test Screen')).toBeTruthy();
    expect(getByText('EditScreenInfo: /test-path')).toBeTruthy();
  });

  it('renders with children', () => {
    const { getByText } = render(
      <ScreenContent {...defaultProps}>
        <Text>Test Child Content</Text>
      </ScreenContent>
    );

    expect(getByText('Test Screen')).toBeTruthy();
    expect(getByText('Test Child Content')).toBeTruthy();
  });

  it('renders without children', () => {
    const { getByText } = render(<ScreenContent {...defaultProps} />);

    expect(getByText('Test Screen')).toBeTruthy();
    expect(getByText('EditScreenInfo: /test-path')).toBeTruthy();
  });

  it('renders with different title and path', () => {
    const { getByText } = render(<ScreenContent title="Another Screen" path="/another-path" />);

    expect(getByText('Another Screen')).toBeTruthy();
    expect(getByText('EditScreenInfo: /another-path')).toBeTruthy();
  });
});
