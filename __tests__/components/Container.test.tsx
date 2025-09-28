import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { Container } from '../../components/Container';

describe('Container Component', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
      <Container>
        <Text>Test Content</Text>
      </Container>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('renders multiple children correctly', () => {
    const { getByText } = render(
      <Container>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </Container>
    );

    expect(getByText('First Child')).toBeTruthy();
    expect(getByText('Second Child')).toBeTruthy();
  });

  it('renders empty container when no children provided', () => {
    const { toJSON } = render(<Container>{null}</Container>);

    expect(toJSON()).toBeTruthy();
  });
});
