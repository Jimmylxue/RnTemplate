// @ts-nocheck

import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Pressable, SafeAreaView, StatusBar, Text} from 'react-native';
import {Home} from '@screen/Home';
import Message from '@screen/Message';
import {Mine} from '@screen/Mine';
import {fetchHeart} from '@api/app/user';
// import {NIcon} from '@components/Icon/NIcon';
import {useNavigation} from '@react-navigation/native';
import {getMessageList} from '@api/app/message';
import {NIcon} from '@components/Icon/NIcon';
const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const navigation = useNavigation();
  // let timer: any = null;
  // const {mutateAsync} = fetchHeart();
  // useEffect(() => {
  //   clearInterval(timer);
  //   timer = setInterval(() => {
  //     mutateAsync();
  //   }, 1000 * 5);
  //   return () => clearInterval(timer);
  // }, []);
  const {data, refetch: refetchMessage} = getMessageList();
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
      <SafeAreaView style={{flex: 1}}>
        <Tab.Navigator
          screenOptions={({route}) => ({
            // tabBarActiveTintColor: '#2a77c9',
            // tabBarInactiveTintColor: '#3db2f5',
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
            },
            tabBarStyle: {
              height: 60,
              paddingBottom: 6, // 控制内部内容的间距
            },
            tabBarIcon: ({color, size}) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Message') {
                iconName = 'message';
              } else if (route.name === 'Mine') {
                iconName = 'user';
              }
              return (
                <Pressable
                  // onPress={() => {
                  //   console.log('route.name', route.name);
                  //   navigation.navigate(route.name as any);
                  // }}
                  className="relative ">
                  <NIcon
                    iconType="Entypo"
                    name={iconName}
                    color={color}
                    size={24}
                    // onPress={() => {
                    //   navigation.navigate(route.name as any);
                    // }}
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
                </Pressable>
              );
            },
          })}>
          <Tab.Screen
            name="Home"
            options={{
              tabBarLabel: '首页',
              unmountOnBlur: true,
            }}
            component={Home}
          />
          <Tab.Screen
            name="Message"
            options={{
              tabBarLabel: '消息',
              unmountOnBlur: true,
            }}
            component={Message}
          />
          <Tab.Screen
            name="Mine"
            options={{
              tabBarLabel: '我的',
              unmountOnBlur: true,
            }}
            component={Mine}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
};
