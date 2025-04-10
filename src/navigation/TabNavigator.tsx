import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaView, StatusBar, Text} from 'react-native';
import {Home} from '@screen/Home';
import Message from '@screen/Message';
import {Mine} from '@screen/Mine';
import {getMessageList} from '@api/app/message';
import {NIcon} from '@components/Icon/NIcon';
const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const [tabKey, setTabKey] = useState(Date.now());
  const {data} = getMessageList();
  const [unreadCount, setUnreadCount] = useState({msg: 0, sys: 0});
  useEffect(() => {
    if (data?.length > 0) {
      const unread = {
        sys: 0,
        msg: 0,
      };
      data.forEach((item: any) => {
        if (item?.letter?.platform === 1 && item?.status === 1) {
          unread.sys += 1;
        }
        if (item?.letter?.platform === 3 && item?.status === 1) {
          unread.msg += 1;
        }
      });
      setUnreadCount(unread);
    }
  }, [data]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView className=" h-screen">
        <Tab.Navigator
          key={tabKey}
          screenOptions={({route}) => ({
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
            },
            tabBarStyle: {
              height: 75,
              paddingBottom: 10, // 控制内部内容的间距
            },
            tabBarIcon: ({color}) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Message') {
                iconName = 'message';
              } else if (route.name === 'Mine') {
                iconName = 'user';
              }
              return (
                <>
                  <NIcon
                    iconType="Entypo"
                    name={iconName}
                    color={color}
                    size={18}
                    style={{
                      marginBottom: -8, // 向下微调图标的位置
                    }}
                  />
                  {unreadCount?.msg > 0 && route.name === 'Message' && (
                    <Text
                      className="absolute -top-1 -right-3"
                      style={{
                        backgroundColor: 'red',
                        width: 20,
                        height: 20,
                        borderRadius: 50,
                        textAlign: 'center',
                        color: '#fff',
                      }}>
                      {unreadCount.msg}
                    </Text>
                  )}
                </>
              );
            },
          })}
          screenListeners={() => ({
            tabPress: () => {
              setTabKey(Date.now());
            },
          })}>
          <Tab.Screen
            name="Home"
            options={{
              tabBarLabel: '首页',
            }}
            component={Home}
          />
          <Tab.Screen
            name="Message"
            options={{
              tabBarLabel: '消息',
            }}
            component={Message}
          />
          <Tab.Screen
            name="Mine"
            options={{
              tabBarLabel: '我的',
            }}
            component={Mine}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
};
