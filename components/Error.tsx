import { forwardRef } from 'react';
import { Text, View, ViewProps } from 'react-native';

type ErrorProps = {
  message: string;
} & ViewProps;

export const Error = forwardRef<View, ErrorProps>(({ message, ...viewProps }, ref) => {
  return (
    <View ref={ref} {...viewProps} className={`${styles.container} ${viewProps.className || ''}`}>
      <Text className={styles.errorText}>{message}</Text>
    </View>
  );
});

const styles = {
  container: 'p-4 bg-red-100 border border-red-400 rounded-md',
  errorText: 'text-red-700 text-center',
};
