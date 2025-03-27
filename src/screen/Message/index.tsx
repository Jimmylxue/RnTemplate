import {fetchReadMessage, getMessageList} from '@api/app/message';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Image, Pressable, ScrollView, Text, View} from 'react-native';

export default function Message() {
  const {mutateAsync: readMsg} = fetchReadMessage();
  const {data, refetch: refetchMessage} = getMessageList();
  const [unreadCount, setUnreadCount] = useState({msg: 0, sys: 0});
  const fadeAnimA = useRef(new Animated.Value(0)).current;
  const fadeAnimB = useRef(new Animated.Value(999)).current;
  const [msgType, setMsgType] = useState(1);

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
  }, [data, msgType]);

  // 切换到 B
  const showB = () => {
    Animated.parallel([
      Animated.timing(fadeAnimA, {
        toValue: 999, // A 渐隐
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimB, {
        toValue: 50, // B 渐显
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 切换回 A
  const showA = () => {
    Animated.parallel([
      Animated.timing(fadeAnimA, {
        toValue: 0, // A 渐显
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimB, {
        toValue: 999, // B 渐隐
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setMsgType(1));
  };

  return (
    <>
      <Animated.Text
        className="mt-16 pl-8 font-bold text-2xl"
        style={{
          transform: [{translateY: fadeAnimA}],
        }}>
        消息
      </Animated.Text>
      <Animated.View
        style={{
          backgroundColor: '#fff',
          borderRadius: 20,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          marginTop: 20,
          marginLeft: 20,
          marginRight: 20,
          transform: [{translateY: fadeAnimA}],
        }}>
        {/* <View
          style={{
            borderBottomColor: "#eee",
            borderBottomWidth: 2,
            padding: 20,
          }}
        >
          <Pressable
            className="ml-2 flex flex-row items-center relative"
            onPress={() => {
              setMsgType(1)
              showB()
              readMsg({ platform: 1 })
            }}
          >
            <Image
              style={{ width: 16, height: 16, marginRight: 12 }}
              source={require("@assets/images/message.png")}
            />
            <Text>系统消息</Text>
            {unreadCount?.sys > 0 && (
              <Text
                style={{
                  marginLeft: "auto",
                  color: "white",
                  backgroundColor: "red",
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  textAlign: "center",
                }}
              >
                {unreadCount?.sys}
              </Text>
            )}
          </Pressable>
        </View> */}
        <View
          style={{
            borderBottomColor: '#eee',
            borderBottomWidth: 2,
            padding: 20,
          }}>
          <Pressable
            className="ml-2 flex flex-row items-center relative"
            onPress={() => {
              setMsgType(3);
              showB();
              readMsg({platform: 3});
            }}>
            <Image
              style={{width: 16, height: 16, marginRight: 12}}
              source={require('@assets/images/user.png')}
            />
            <Text>客服消息</Text>
            {unreadCount?.msg > 0 && (
              <Text
                style={{
                  marginLeft: 'auto',
                  color: 'white',
                  backgroundColor: 'red',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  textAlign: 'center',
                }}>
                {unreadCount?.msg}
              </Text>
            )}
          </Pressable>
        </View>
      </Animated.View>
      <Animated.View
        className=" bg-white rounded-2xl p-2  absolute top-0"
        style={{
          height: '90%',
          width: '90%',
          marginLeft: '5%',
          transform: [{translateY: fadeAnimB}],
        }}>
        <ScrollView style={{flex: 1, width: '100%'}}>
          {data?.filter((item: any) => {
            if (item.letter.platform === msgType) {
              return true;
            }
            return false;
          }).length === 0 && <Text>暂无消息</Text>}
          {data
            ?.filter((item: any) => {
              if (item.letter.platform === msgType) {
                return true;
              }
              return false;
            })
            .map((item: any) => (
              <View
                key={item.recordId}
                className="my-2 border-b border-gray-200 pb-4 w-full">
                <View className=" flex flex-row items-center justify-stretch">
                  <Image
                    source={require('@assets/images/megaphone.png')}
                    className="w-12 h-12"
                  />
                  <Text className="ml-2">
                    {msgType === 0 ? item.letter.title : '客服消息'}
                  </Text>
                  {item.status === 1 && (
                    <View
                      className="w-2 h-2 bg-red-600 ml-1"
                      style={{borderRadius: 4}}></View>
                  )}
                </View>
                <Text className="px-8">{item.letter.content}</Text>
                {item.letter?.imgUrl && (
                  <Image
                    source={{uri: item.letter.imgUrl}}
                    className="w-full my-2 h-96"
                  />
                )}
                <Text className="text-right mr-4">
                  {moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </View>
            ))}
        </ScrollView>
        <Pressable
          style={{
            position: 'absolute',
            top: -40,
            left: '50%',
            zIndex: 2,
            padding: 10,
            transform: [{translateX: -25}],
          }}
          onPress={async () => {
            await refetchMessage();
            showA();
          }}>
          <Text
            style={{
              height: 36,
              width: 36,
              backgroundColor: 'rgba(0,0,0,.4)',
              borderRadius: 18,
              textAlign: 'center',
              lineHeight: 36,
              color: 'white',
            }}>
            X
          </Text>
        </Pressable>
      </Animated.View>
    </>
  );
}
