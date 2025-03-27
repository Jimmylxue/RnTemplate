/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Text, View} from 'react-native';
import './src/styles/global.css';

import {ComposeProviders} from '@components/ComposeProviders';

function App(): React.JSX.Element {
  return (
    <ComposeProviders components={[]}>
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Hello Worldsss</Text>
      </View>
    </ComposeProviders>
  );
}

export default App;
