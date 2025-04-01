import React, {useEffect} from 'react';
import {RootSiblingParent} from 'react-native-root-siblings';
import {ComposeProviders} from '@components/ComposeProviders';
import {ErrorHandler} from '@components/ErrorHandler';
import {ApiProvider} from '@api/ApiProvider';
import {NavigationContainer} from '@navigation/NavigationContainer';
import Toast from 'react-native-toast-message';
import {RootNavigator} from '@navigation/RootNavigator';
import codePush from 'react-native-code-push';
import RNRestart from 'react-native-restart';
import './src/styles/global.css';

const codePushOptions = {
  // 生产环境配置
  // checkFrequency: codePush.CheckFrequency.ON_APP_START,
  checkFrequency: codePush.CheckFrequency.MANUAL,
};

function App(): React.JSX.Element {
  const checkForUpdate = () => {
    Toast.show({
      text1: '检查更新中...',
      type: 'info',
    });
    codePush.checkForUpdate().then(update => {
      if (update) {
        codePush
          .sync({
            updateDialog: {
              appendReleaseDescription: false,
              descriptionPrefix: '\n\n更新内容：\n',
              title: '发现新版本',
              mandatoryUpdateMessage: '更新内容：\n' + update.description,
              mandatoryContinueButtonLabel: '确定',
            },
          })
          .then(status => {
            if (status === codePush.SyncStatus.UPDATE_INSTALLED) {
              Toast.show({
                text1: '更新成功，即将重新启动',
                type: 'success',
              });
              setTimeout(() => {
                RNRestart.restart();
              }, 1500);
            }
          });
      }
    });
  };

  useEffect(() => {
    checkForUpdate();
  }, []);

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
