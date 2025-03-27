import type {FC} from 'react';
import type React from 'react';
import {Text, TouchableOpacity, View, ViewProps} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';

type Props = {
  error: Error;
  resetError: () => void;
};

const ErrorFallback = ({resetError, error}: Props) => {
  return (
    <View className="flex-1 flex-col items-center justify-center space-y-6 bg-white px-2">
      <Text className="text-center">出了问题：{error.message}</Text>
      <TouchableOpacity
        onPress={() => {
          resetError();
        }}
        className="mt-2 min-h-10 min-w-40 items-center rounded-xl bg-primary-0 p-3">
        <Text className="text-lg text-white">重试</Text>
      </TouchableOpacity>
    </View>
  );
};

const onError = (error: Error) => {
  console.log(error);
};

interface TProps extends ViewProps {
  children: any;
}

export const ErrorHandler: FC<TProps> = ({children}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
};
