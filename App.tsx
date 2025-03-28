import React, {useEffect} from 'react';
import {RootSiblingParent} from 'react-native-root-siblings';
import {ComposeProviders} from '@components/ComposeProviders';
import {ErrorHandler} from '@components/ErrorHandler';
import {ApiProvider} from '@api/ApiProvider';
import {NavigationContainer} from '@navigation/NavigationContainer';
import Toast from 'react-native-toast-message';
import {RootNavigator} from '@navigation/RootNavigator';
import codePush from 'react-native-code-push';
import './src/styles/global.css';

const codePushOptions = {
  // 生产环境配置
  // checkFrequency: codePush.CheckFrequency.ON_APP_START,
  checkFrequency: codePush.CheckFrequency.MANUAL,
};

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

export default codePush(codePushOptions)(App);
