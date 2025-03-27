import {NavigationContainer as RNNavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {navigationRef} from './navigate';

export const NavigationContainer = ({children}: any) => {
  return (
    <SafeAreaProvider>
      <RNNavigationContainer
        ref={navigationRef}
        // linking={OMLinking}
        fallback={
          <View className="h-full items-center justify-center gap-y-2">
            <Text>加载中...</Text>
          </View>
        }
        onReady={() => {
          // BootSplash.hide({ fade: true })
          // // 登录后才上报
          // if (loginStatus === 'login') {
          // 	return
          // }
          // routeNameRef.current = navigationRef.getCurrentRoute()?.name
          // // 初始化上报一次
          // report({
          // 	page: routeNameRef.current,
          // 	prePage: '',
          // 	type: 'page',
          // })
        }}
        onStateChange={async () => {
          // 登录后才上报
          // if (loginStatus === 'login') {
          // 	return
          // }
          // const currentRouteName = navigationRef.getCurrentRoute()?.name
          // const previousRouteName = routeNameRef.current
          // const trackScreenView = (
          // 	prev: string | undefined,
          // 	next: string | undefined
          // ) => {
          // 	// Your implementation of analytics goes here!
          // 	report({
          // 		page: next,
          // 		prePage: prev,
          // 		type: 'page',
          // 	})
          // }
          // if (previousRouteName !== currentRouteName) {
          // 	// Save the current route name for later comparison
          // 	routeNameRef.current = currentRouteName
          // 	// Replace the line below to add the tracker from a mobile analytics SDK
          // 	await trackScreenView(previousRouteName, currentRouteName)
          // }
        }}>
        {children}
      </RNNavigationContainer>
    </SafeAreaProvider>
  );
};
