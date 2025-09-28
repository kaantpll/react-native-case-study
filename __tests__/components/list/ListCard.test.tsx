import { fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';
import React from 'react';

import { ListCard } from '../../../components/list/ListCard';
import { List } from '../../../types';

jest.mock('../../../hooks/useLists', () => ({
  useDeleteList: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

jest.mock('../../../store/modalStore', () => ({
  useModalStore: jest.fn(() => ({
    openEdit: jest.fn(),
  })),
}));

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.spyOn(Alert, 'alert');

describe('ListCard Component', () => {
  const mockList: List = {
    id: 1,
    name: 'Test List',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with list data', () => {
    const { getByText } = render(<ListCard list={mockList} />);

    expect(getByText('Test List')).toBeTruthy();
    expect(getByText('Jan 2, 2024')).toBeTruthy();
  });

  it('calls openEdit when edit button is pressed', () => {
    const mockOpenEdit = jest.fn();
    const useModalStore = require('../../../store/modalStore').useModalStore;
    useModalStore.mockReturnValue({ openEdit: mockOpenEdit });

    const { UNSAFE_getAllByType } = render(<ListCard list={mockList} />);

    const TouchableOpacity = require('react-native').TouchableOpacity;
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    const editButton = buttons[1];

    fireEvent.press(editButton);

    expect(mockOpenEdit).toHaveBeenCalledWith({
      id: mockList.id,
      name: mockList.name,
    });
  });

  it('shows delete confirmation when delete button is pressed', () => {
    const { UNSAFE_getAllByType } = render(<ListCard list={mockList} />);

    const TouchableOpacity = require('react-native').TouchableOpacity;
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    const deleteButton = buttons[2];

    fireEvent.press(deleteButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete List',
      'Are you sure you want to delete Test List?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
        expect.objectContaining({ text: 'Delete', style: 'destructive' }),
      ])
    );
  });

  it('calls deleteList when delete is confirmed', () => {
    const mockMutate = jest.fn();
    const useDeleteList = require('../../../hooks/useLists').useDeleteList;
    useDeleteList.mockReturnValue({ mutate: mockMutate });

    const { UNSAFE_getAllByType } = render(<ListCard list={mockList} />);

    const TouchableOpacity = require('react-native').TouchableOpacity;
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    const deleteButton = buttons[2];

    fireEvent.press(deleteButton);

    const alertCalls = (Alert.alert as jest.Mock).mock.calls[0];
    const deleteAction = alertCalls[2].find((action: any) => action.text === 'Delete');
    deleteAction.onPress();

    expect(mockMutate).toHaveBeenCalledWith(mockList.id);
  });

  it('shows delete confirmation when delete button is pressed', () => {
    const { UNSAFE_getAllByType } = render(<ListCard list={mockList} />);

    const TouchableOpacity = require('react-native').TouchableOpacity;
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    const deleteButton = buttons[2];

    fireEvent.press(deleteButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete List',
      'Are you sure you want to delete Test List?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
        expect.objectContaining({ text: 'Delete', style: 'destructive' }),
      ])
    );
  });

  it('calls deleteList when delete is confirmed', () => {
    const mockMutate = jest.fn();
    const useDeleteList = require('../../../hooks/useLists').useDeleteList;
    useDeleteList.mockReturnValue({ mutate: mockMutate });

    const { UNSAFE_getAllByType } = render(<ListCard list={mockList} />);

    const TouchableOpacity = require('react-native').TouchableOpacity;
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    const deleteButton = buttons[2];

    fireEvent.press(deleteButton);

    const alertCalls = (Alert.alert as jest.Mock).mock.calls[0];
    const deleteAction = alertCalls[2].find((action: any) => action.text === 'Delete');
    deleteAction.onPress();

    expect(mockMutate).toHaveBeenCalledWith(mockList.id);
  });

  it('calls deleteList when delete is confirmed', () => {
    const mockMutate = jest.fn();
    const useDeleteList = require('../../../hooks/useLists').useDeleteList;
    useDeleteList.mockReturnValue({ mutate: mockMutate });

    const { UNSAFE_getAllByType } = render(<ListCard list={mockList} />);

    const TouchableOpacity = require('react-native').TouchableOpacity;
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    const deleteButton = buttons[2];

    fireEvent.press(deleteButton);

    const alertCalls = (Alert.alert as jest.Mock).mock.calls[0];
    const deleteAction = alertCalls[2].find((action: any) => action.text === 'Delete');
    deleteAction.onPress();

    expect(mockMutate).toHaveBeenCalledWith(mockList.id);
  });

  it('truncates long list names', () => {
    const longNameList: List = {
      ...mockList,
      name: 'This is a very long list name that should be truncated',
    };

    const { getByText } = render(<ListCard list={longNameList} />);

    const titleElement = getByText(longNameList.name);
    expect(titleElement).toBeTruthy();
    expect(titleElement.props.numberOfLines).toBe(1);
    expect(titleElement.props.ellipsizeMode).toBe('tail');
  });

  it('formats date correctly', () => {
    const specificDateList: List = {
      ...mockList,
      updated_at: '2024-12-25T15:30:00Z',
    };

    const { getByText } = render(<ListCard list={specificDateList} />);

    expect(getByText('Dec 25, 2024')).toBeTruthy();
  });

  it('renders with different list data', () => {
    const differentList: List = {
      id: 2,
      name: 'Another List',
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-02-15T00:00:00Z',
    };

    const { getByText } = render(<ListCard list={differentList} />);

    expect(getByText('Another List')).toBeTruthy();
    expect(getByText('Feb 15, 2024')).toBeTruthy();
  });
});
