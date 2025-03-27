import React from 'react';
import {RootSiblingParent} from 'react-native-root-siblings';
import {ComposeProviders} from '@components/ComposeProviders';
import {ErrorHandler} from '@components/ErrorHandler';
import {ApiProvider} from '@api/ApiProvider';
import {NavigationContainer} from '@navigation/NavigationContainer';
import Toast from 'react-native-toast-message';
import {RootNavigator} from '@navigation/RootNavigator';
import './src/styles/global.css';

function App(): React.JSX.Element {
  return (
    <ComposeProviders
      components={[
        RootSiblingParent,
        ErrorHandler,
        ApiProvider,
        NavigationContainer,
      ]}>
      <RootNavigator />
      <Toast topOffset={60} />
    </ComposeProviders>
  );
}

export default App;
