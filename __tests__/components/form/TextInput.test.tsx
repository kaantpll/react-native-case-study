import { fireEvent, render } from '@testing-library/react-native';
import { TextInput } from '../../../components/form/TextInput';

describe('TextInput Component', () => {
  it('renders correctly without label and error', () => {
    const { getByDisplayValue } = render(<TextInput value="test input" />);

    expect(getByDisplayValue('test input')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(<TextInput label="Username" value="" />);

    expect(getByText('Username')).toBeTruthy();
  });

  it('renders with error message', () => {
    const { getByText } = render(<TextInput error="This field is required" value="" />);

    expect(getByText('This field is required')).toBeTruthy();
  });

  it('renders with both label and error', () => {
    const { getByText } = render(<TextInput label="Email" error="Invalid email format" value="" />);

    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Invalid email format')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <TextInput value="initial" onChangeText={mockOnChangeText} />
    );

    const input = getByDisplayValue('initial');
    fireEvent.changeText(input, 'new text');

    expect(mockOnChangeText).toHaveBeenCalledWith('new text');
  });

  it('renders as textarea when isTextArea is true', () => {
    const { getByDisplayValue } = render(<TextInput value="textarea content" isTextArea />);

    const textarea = getByDisplayValue('textarea content');
    expect(textarea).toBeTruthy();
  });

  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <TextInput placeholder="Enter your text here" value="" />
    );

    expect(getByPlaceholderText('Enter your text here')).toBeTruthy();
  });

  it('applies custom container className', () => {
    const { toJSON } = render(<TextInput containerClassName="custom-container" value="" />);

    expect(toJSON()).toBeTruthy();
  });

  it('applies custom input className', () => {
    const { toJSON } = render(<TextInput inputClassName="custom-input" value="" />);

    expect(toJSON()).toBeTruthy();
  });

  it('calls onFocus when input is focused', () => {
    const mockOnFocus = jest.fn();
    const { getByDisplayValue } = render(<TextInput value="test" onFocus={mockOnFocus} />);

    const input = getByDisplayValue('test');
    fireEvent(input, 'focus');

    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('calls onBlur when input loses focus', () => {
    const mockOnBlur = jest.fn();
    const { getByDisplayValue } = render(<TextInput value="test" onBlur={mockOnBlur} />);

    const input = getByDisplayValue('test');
    fireEvent(input, 'blur');

    expect(mockOnBlur).toHaveBeenCalled();
  });
});
