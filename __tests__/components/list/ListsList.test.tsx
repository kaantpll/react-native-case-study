import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ListsList } from '../../../components/list/ListsList';
import { List } from '../../../types';

jest.mock('../../../components/EmptyState', () => ({
  EmptyState: ({ title, description }: { title: string; description?: string }) => {
    const React = require('react');
    const { Text, View } = require('react-native');
    return (
      <View>
        <Text>{title}</Text>
        {description && <Text>{description}</Text>}
      </View>
    );
  },
}));

jest.mock('../../../components/Loading', () => ({
  Loading: () => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text>Loading...</Text>;
  },
}));

jest.mock('../../../components/list/ListCard', () => ({
  ListCard: ({ list }: { list: List }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text>ListCard: {list.name}</Text>;
  },
}));

describe('ListsList Component', () => {
  const mockLists: List[] = [
    {
      id: 1,
      name: 'First List',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Second List',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  const defaultProps = {
    lists: mockLists,
    refetch: jest.fn(),
    isSearching: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with lists', () => {
    const { getByText } = render(<ListsList {...defaultProps} />);

    expect(getByText('ListCard: First List')).toBeTruthy();
    expect(getByText('ListCard: Second List')).toBeTruthy();
  });

  it('renders loading when isSearching is true', () => {
    const { getByText, queryByText } = render(<ListsList {...defaultProps} isSearching />);

    expect(getByText('Loading...')).toBeTruthy();
    expect(queryByText('ListCard: First List')).toBeFalsy();
  });

  it('renders empty state when no lists', () => {
    const { getByText } = render(<ListsList {...defaultProps} lists={[]} />);

    expect(getByText('No lists yet')).toBeTruthy();
    expect(getByText('Create your first list to get started')).toBeTruthy();
  });

  it('calls refetch when pull to refresh is triggered', () => {
    const mockRefetch = jest.fn();
    const { UNSAFE_getByType } = render(<ListsList {...defaultProps} refetch={mockRefetch} />);

    const RefreshControl = require('react-native').RefreshControl;
    const refreshControl = UNSAFE_getByType(RefreshControl);

    fireEvent(refreshControl, 'onRefresh');

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('renders with single list', () => {
    const singleList = [mockLists[0]];
    const { getByText, queryByText } = render(<ListsList {...defaultProps} lists={singleList} />);

    expect(getByText('ListCard: First List')).toBeTruthy();
    expect(queryByText('ListCard: Second List')).toBeFalsy();
  });

  it('renders with empty lists array', () => {
    const { getByText } = render(<ListsList {...defaultProps} lists={[]} />);

    expect(getByText('No lists yet')).toBeTruthy();
  });

  it('does not render empty state when isSearching is true even with no lists', () => {
    const { getByText, queryByText } = render(
      <ListsList {...defaultProps} lists={[]} isSearching />
    );

    expect(getByText('Loading...')).toBeTruthy();
    expect(queryByText('No lists yet')).toBeFalsy();
  });

  it('handles refresh control properly', () => {
    const { UNSAFE_getByType } = render(<ListsList {...defaultProps} />);

    const FlatList = require('react-native').FlatList;
    const flatList = UNSAFE_getByType(FlatList);

    expect(flatList.props.refreshControl).toBeTruthy();
    expect(flatList.props.showsVerticalScrollIndicator).toBe(false);
  });

  it('uses correct keyExtractor', () => {
    const { UNSAFE_getByType } = render(<ListsList {...defaultProps} />);

    const FlatList = require('react-native').FlatList;
    const flatList = UNSAFE_getByType(FlatList);

    const keyExtractor = flatList.props.keyExtractor;
    expect(keyExtractor(mockLists[0])).toBe('1');
    expect(keyExtractor(mockLists[1])).toBe('2');
  });
});
