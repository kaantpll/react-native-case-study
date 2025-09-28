import { render } from '@testing-library/react-native';
import React from 'react';

import { EmptyState } from '../../components/EmptyState';

describe('EmptyState Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<EmptyState title="No items found" />);

    expect(getByText('No items found')).toBeTruthy();
  });

  it('renders with title and description', () => {
    const title = 'No tasks available';
    const description = 'Create your first task to get started';
    const { getByText } = render(<EmptyState title={title} description={description} />);

    expect(getByText(title)).toBeTruthy();
    expect(getByText(description)).toBeTruthy();
  });

  it('does not render description when not provided', () => {
    const title = 'Empty state';
    const { getByText, queryByText } = render(<EmptyState title={title} />);

    expect(getByText(title)).toBeTruthy();
    expect(queryByText(/description/i)).toBeFalsy();
  });
});
