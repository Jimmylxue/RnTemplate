import {useAppState} from '@hooks/useAppState';
import {useOnLineManager} from '@hooks/useOnLineManager';
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import React from 'react';
import type {AppStateStatus, ViewProps} from 'react-native';

function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === 'active');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface TProps extends ViewProps {}

console.log('ApiProvider', useOnLineManager);

export const ApiProvider = ({children}: TProps) => {
  useOnLineManager();
  useAppState(onAppStateChange);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
