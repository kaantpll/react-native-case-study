import { forwardRef } from 'react';
import { ActivityIndicator, View, ViewProps } from 'react-native';

type LoadingProps = {
  size?: 'small' | 'large';
  color?: string;
} & ViewProps;

export const Loading = forwardRef<View, LoadingProps>(
  ({ size = 'large', color = '#3b82f6', ...viewProps }, ref) => {
    return (
      <View ref={ref} {...viewProps} className={`${styles.container} ${viewProps.className || ''}`}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }
);

const styles = {
  container: 'flex-1 justify-center items-center',
};
