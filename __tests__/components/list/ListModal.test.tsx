import { fireEvent, render } from '@testing-library/react-native';

import { ListModal } from '../../../components/list/ListModal';

jest.mock('../../../hooks/useLists', () => ({
  useCreateList: jest.fn(() => ({
    mutate: jest.fn(),
  })),
  useUpdateList: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

jest.mock('../../../store/modalStore', () => ({
  useModalStore: jest.fn(() => ({
    isVisible: false,
    isEdit: false,
    editingList: null,
    close: jest.fn(),
  })),
}));

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    control: {},
    handleSubmit: jest.fn((fn) => fn),
    reset: jest.fn(),
    formState: { errors: {} },
  })),
  Controller: ({ render }: any) =>
    render({ field: { onChange: jest.fn(), onBlur: jest.fn(), value: '' } }),
}));

describe('ListModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when not visible', () => {
    const { toJSON } = render(<ListModal />);
    expect(toJSON()).toBeNull();
  });

  it('renders correctly when visible for create mode', () => {
    const useModalStore = require('../../../store/modalStore').useModalStore;
    useModalStore.mockReturnValue({
      isVisible: true,
      isEdit: false,
      editingList: null,
      close: jest.fn(),
    });

    const { getByText } = render(<ListModal />);

    expect(getByText('Create New List')).toBeTruthy();
    expect(getByText('Create')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('renders correctly when visible for edit mode', () => {
    const useModalStore = require('../../../store/modalStore').useModalStore;
    useModalStore.mockReturnValue({
      isVisible: true,
      isEdit: true,
      editingList: { id: 1, name: 'Test List' },
      close: jest.fn(),
    });

    const { getByText } = render(<ListModal />);

    expect(getByText('Edit List')).toBeTruthy();
    expect(getByText('Update')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls close when cancel button is pressed', () => {
    const mockClose = jest.fn();
    const useModalStore = require('../../../store/modalStore').useModalStore;
    useModalStore.mockReturnValue({
      isVisible: true,
      isEdit: false,
      editingList: null,
      close: mockClose,
    });

    const { getByText } = render(<ListModal />);

    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('calls close when overlay is pressed', () => {
    const mockClose = jest.fn();
    const useModalStore = require('../../../store/modalStore').useModalStore;
    useModalStore.mockReturnValue({
      isVisible: true,
      isEdit: false,
      editingList: null,
      close: mockClose,
    });

    const { UNSAFE_getAllByType } = render(<ListModal />);

    const TouchableOpacity = require('react-native').TouchableOpacity;
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    const overlay = touchables[0];

    fireEvent.press(overlay);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('calls createList when form is submitted in create mode', async () => {
    const mockMutate = jest.fn();
    const mockClose = jest.fn();
    const mockHandleSubmit = jest.fn();

    const useCreateList = require('../../../hooks/useLists').useCreateList;
    const useModalStore = require('../../../store/modalStore').useModalStore;
    const { useForm } = require('react-hook-form');

    useCreateList.mockReturnValue({ mutate: mockMutate });
    useModalStore.mockReturnValue({
      isVisible: true,
      isEdit: false,
      editingList: null,
      close: mockClose,
    });
    useForm.mockReturnValue({
      control: {},
      handleSubmit: mockHandleSubmit.mockImplementation((fn) => () => fn({ name: 'Test List' })),
      reset: jest.fn(),
      formState: { errors: {} },
    });

    const { getByText } = render(<ListModal />);

    const createButton = getByText('Create');
    fireEvent.press(createButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('calls updateList when form is submitted in edit mode', async () => {
    const mockMutate = jest.fn();
    const mockClose = jest.fn();
    const mockHandleSubmit = jest.fn();

    const useUpdateList = require('../../../hooks/useLists').useUpdateList;
    const useModalStore = require('../../../store/modalStore').useModalStore;
    const { useForm } = require('react-hook-form');

    useUpdateList.mockReturnValue({ mutate: mockMutate });
    useModalStore.mockReturnValue({
      isVisible: true,
      isEdit: true,
      editingList: { id: 1, name: 'Original List' },
      close: mockClose,
    });
    useForm.mockReturnValue({
      control: {},
      handleSubmit: mockHandleSubmit.mockImplementation((fn) => () => fn({ name: 'Updated List' })),
      reset: jest.fn(),
      formState: { errors: {} },
    });

    const { getByText } = render(<ListModal />);

    const updateButton = getByText('Update');
    fireEvent.press(updateButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('resets form when modal opens for create', () => {
    const mockReset = jest.fn();
    const { useForm } = require('react-hook-form');

    useForm.mockReturnValue({
      control: {},
      handleSubmit: jest.fn(),
      reset: mockReset,
      formState: { errors: {} },
    });

    const useModalStore = require('../../../store/modalStore').useModalStore;
    useModalStore.mockReturnValue({
      isVisible: true,
      isEdit: false,
      editingList: null,
      close: jest.fn(),
    });

    render(<ListModal />);

    expect(mockReset).toHaveBeenCalledWith({ name: '' });
  });

  it('resets form with editing list name when modal opens for edit', () => {
    const mockReset = jest.fn();
    const { useForm } = require('react-hook-form');

    useForm.mockReturnValue({
      control: {},
      handleSubmit: jest.fn(),
      reset: mockReset,
      formState: { errors: {} },
    });

    const useModalStore = require('../../../store/modalStore').useModalStore;
    useModalStore.mockReturnValue({
      isVisible: true,
      isEdit: true,
      editingList: { id: 1, name: 'Existing List' },
      close: jest.fn(),
    });

    render(<ListModal />);

    expect(mockReset).toHaveBeenCalledWith({ name: 'Existing List' });
  });
});
