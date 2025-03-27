import type React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '@screen/Login';

const Stack = createNativeStackNavigator();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          title: '',
          // headerBackTitleVisible: true,
          headerTransparent: true,
        }}
      />
      {/* <Stack.Screen
				name="ForgetPassword"
				component={ForgetPassword}
				options={{
					headerShown: true,
					title: '',
					headerBackTitleVisible: false,
					headerTransparent: true,
				}}
			/> */}
      {/* <Stack.Screen name="WebView" component={WebViewScreen} /> */}
    </Stack.Navigator>
  );
};
