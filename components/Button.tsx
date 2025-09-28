import { forwardRef } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ActivityIndicator,
} from 'react-native';

type ButtonProps = {
  title: string;
  isLoading?: boolean;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  ({ title, isLoading = false, ...touchableProps }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        className={`${styles.button} ${touchableProps.className} ${isLoading ? styles.loadingButton : ''}`}
        disabled={isLoading || touchableProps.disabled}>
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text className={styles.buttonText}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }
);

const styles = {
  button: 'items-center bg-indigo-500 rounded-[28px] shadow-md p-4',
  loadingButton: 'opacity-75',
  buttonText: 'text-white text-lg font-semibold text-center',
};
