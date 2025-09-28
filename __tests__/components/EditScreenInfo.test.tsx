import { render } from '@testing-library/react-native';
import React from 'react';

import { EditScreenInfo } from '../../components/EditScreenInfo';

describe('EditScreenInfo Component', () => {
  it('renders correctly with path', () => {
    const { getByText } = render(<EditScreenInfo path="/test-path" />);

    expect(getByText('Open up the code for this screen:')).toBeTruthy();
    expect(getByText('/test-path')).toBeTruthy();
    expect(
      getByText('Change any of the text, save the file, and your app will automatically update.')
    ).toBeTruthy();
  });

  it('renders with different path', () => {
    const { getByText } = render(<EditScreenInfo path="/another/path/component.tsx" />);

    expect(getByText('Open up the code for this screen:')).toBeTruthy();
    expect(getByText('/another/path/component.tsx')).toBeTruthy();
  });

  it('renders with empty path', () => {
    const { getByText } = render(<EditScreenInfo path="" />);

    expect(getByText('Open up the code for this screen:')).toBeTruthy();
    expect(getByText('')).toBeTruthy();
  });

  it('renders all static text content', () => {
    const { getByText } = render(<EditScreenInfo path="/test" />);

    const title = 'Open up the code for this screen:';
    const description =
      'Change any of the text, save the file, and your app will automatically update.';

    expect(getByText(title)).toBeTruthy();
    expect(getByText(description)).toBeTruthy();
  });
});
