import React from 'react';
import {getProductList} from '@api/app';
import {getCommonMessageList} from '@api/app/message';
import {fetchCoin, getPlantForm} from '@api/app/user';
import {fetchGetCoin} from '@api/app/withdraw';
import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  BackHandler,
  Image,
  StyleSheet,
  Pressable,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Toast from 'react-native-toast-message';
// 基于expo的项目使用expo install react-native-webview 安装该包
import {WebView} from 'react-native-webview';

function getCoin(coin: number) {
  Toast.show({
    type: 'success',
    text1: `浏览获得金币：${coin}`,
    visibilityTime: 2000,
    text1Style: {
      color: 'red',
      fontSize: 20,
      textAlign: 'center',
    },
  });
}

let globalUri: any = {};

export function Home() {
  const [linkType, setLinkType] = useState(-1);
  const {data, refetch} = getProductList({linkTypeId: linkType}, linkType);
  const [uri, setUrl] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isStop, setIsStop] = useState<boolean>(false);
  const [visitTime, setVisitTime] = useState(15);
  const {mutateAsync: reqCoin} = fetchGetCoin();
  const [isAutoClick, setIsAutoClick] = useState(false);
  const fadeAnimA = useRef(new Animated.Value(0)).current;
  const {data: platformList} = getPlantForm() as any;
  const {data: coin, refetch: getCoinFetch} = fetchCoin() as any;
  const {data: commonMsg = []} = getCommonMessageList() as any;

  const handleInjectJavaScript = `
    (function() {
      // 等待页面加载完成
      setTimeout(() => {
        const imgElement = document.querySelector('img[src="https://gw.alicdn.com/tfs/TB1QZN.CYj1gK0jSZFuXXcrHpXa-200-200.png"]');
        if (imgElement) {
          imgElement.click(); // 自动模拟点击
        }
      }, 0)
    })();
  `;
  useEffect(() => {
    if (!isAutoClick) {
      return;
    }
    if (data?.data?.length > 0) {
      setIsStop(false);
      setUrl(data?.data?.[0]);
      setVisitTime(data?.data?.[0]?.visitTime);
    }
  }, [data, isAutoClick]);

  useEffect(() => {
    const onBackPress = () => {
      if (isStop) {
        async function refreshData() {
          setIsLoading(true);
          await refetch();
          setIsStop(false);
          setUrl(data?.data?.[0]);
          setVisitTime(data?.data?.[0]?.visitTime);
        }
        refreshData();
        return true;
      }
      return false;
    };

    const event = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => {
      event.remove();
    };
  }, [isStop]);

  const gainCoinFn = (uri: any) => {
    globalUri = uri;
    /**
     * 随机0~10s 的 settimeout
     */
    const randomTime = Math.floor(Math.random() * 10000);
    setTimeout(() => {
      getCoin(globalUri?.coin);
      reqCoin({linkId: globalUri?.linkId});
      getCoinFetch();
    }, randomTime);
  };

  useEffect(() => {
    let timer: any;
    if (isLoading) {
      return;
    }
    if (visitTime > 0) {
      timer = setTimeout(() => setVisitTime(vit => vit - 1), 1000);
    } else {
      gainCoinFn(uri);
      if (isAutoClick) {
        refetch();
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [uri, visitTime, isLoading, isAutoClick]);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      overflow: 'hidden', // 防止内容溢出
      backgroundColor: '#f5f5f5',
      paddingVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    animatedContainer: {
      flexDirection: 'row',
    },
    messageBox: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      fontSize: 16,
      color: '#333',
    },
    placeholder: {
      fontSize: 14,
      color: '#999',
    },
  });
  const screenWidth = 500; // 获取屏幕宽度
  const scrollX = useRef(new Animated.Value(0)).current; // 初始化动画值

  useEffect(() => {
    if (commonMsg?.result?.length > 0) {
      const messageContainerWidth = screenWidth * commonMsg?.result?.length;

      // 启动无缝横向滚动动画
      const startScroll = () => {
        Animated.loop(
          Animated.timing(scrollX, {
            toValue: -messageContainerWidth, // 滚动到所有消息的末尾
            duration: commonMsg?.result?.length * 5000, // 根据消息数量动态计算总时间
            useNativeDriver: true, // 使用原生驱动
          }),
        ).start();
      };

      startScroll();
    }
  }, [commonMsg?.result, scrollX, screenWidth]);
  return (
    <SafeAreaView className=" h-screen">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View
        style={{
          position: 'relative',
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: StatusBar.currentHeight,
        }}>
        <Animated.View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            position: 'absolute',
            top: StatusBar.currentHeight,
            transform: [{translateY: fadeAnimA}],
            zIndex: 999,
            padding: 20,
          }}>
          {platformList?.map((item: any) => (
            <Pressable
              key={item?.linkTypeId}
              style={{
                backgroundColor: 'rgba(0,0,0,.1)',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}
              className="relative"
              onPress={() => {
                if (item?.openStatus === 2) {
                  Toast.show({
                    type: 'error',
                    text1: '该平台暂未开放',
                    visibilityTime: 1500,
                  });
                  return;
                }
                setLinkType(item?.linkTypeId);
                Animated.parallel([
                  Animated.timing(fadeAnimA, {
                    toValue: 999, // A 渐显
                    duration: 500,
                    useNativeDriver: true,
                  }),
                ]).start();
              }}>
              <View className="flex flex-row items-center">
                <Image
                  source={{uri: item?.mainImage}}
                  width={50}
                  height={50}
                  borderRadius={25}
                  className="ml-10"
                />
                <Text className="text-2xl ml-4">{item?.name}</Text>
              </View>
              <View
                className="absolute"
                style={{
                  top: 50,
                  right: 10,
                  backgroundColor: item?.openStatus === 2 ? 'red' : 'green',
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  transform: [{translateX: -25}, {translateY: -20}],
                }}></View>
            </Pressable>
          ))}
        </Animated.View>
        <View
          className="justify-evenly"
          style={{
            position: 'absolute',
            top: StatusBar.currentHeight,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            zIndex: 3,
            height: 40,
            paddingHorizontal: 20,
          }}>
          <View
            className="w-32 flex flex-row items-center"
            // style={{
            //   borderColor: "#3db2f5",
            //   borderWidth: 1,
            //   borderRadius: 50,
            //   padding: 5,
            // }}
          >
            <Image
              source={require('@assets/images/coin.png')}
              style={{width: 20, height: 20, borderRadius: 50}}
            />
            <Text style={{color: '#3db2f5'}} className="text-xl">
              {coin as any}
            </Text>
          </View>
          <Pressable
            className="w-32 text-center flex flex-row items-center justify-center"
            style={{
              borderColor: '#3db2f5',
              borderWidth: 1,
              borderRadius: 50,
              padding: 5,
            }}
            onPress={() => {
              Animated.parallel([
                Animated.timing(fadeAnimA, {
                  toValue: 0, // A 渐显
                  duration: 500,
                  useNativeDriver: true,
                }),
              ]).start();
            }}>
            <Text
              style={{
                color: '#3db2f5',
              }}>
              {platformList?.find((item: any) => item.linkTypeId === linkType)
                ?.name || ''}
            </Text>
          </Pressable>
          <Pressable
            className="w-32 flex flex-row justify-end"
            onPress={() => {
              setIsAutoClick(!isAutoClick);
            }}>
            <Text
              className="text-center "
              style={{
                borderColor: '#3db2f5',
                borderWidth: 1,
                borderRadius: 50,
                padding: 5,
                color: '#3db2f5',
                width: 60,
              }}>
              {isAutoClick ? '暂停' : '开始'}
            </Text>
          </Pressable>
        </View>
        {commonMsg?.result?.length > 0 && (
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                transform: [{translateX: scrollX}],
                width: screenWidth * commonMsg?.result.length * 2, // 容器宽度为消息宽度的两倍（实现无缝循环）
                borderTopColor: '#eee',
                borderTopWidth: 1,
              },
            ]}>
            {[...commonMsg?.result, ...commonMsg?.result].map(
              (message, index) => (
                <View
                  key={index}
                  style={[styles.messageBox, {width: screenWidth}]}>
                  <Text style={styles.message}>{message?.content}</Text>
                </View>
              ),
            )}
          </Animated.View>
        )}
        {/* {!isLoading && !isOtherPage && ( */}
        {/* {!isStop && !isAutoClick && (
        <Pressable
          onPress={() => refetch()}
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,.3)",
            padding: 20,
            borderRadius: 50,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "white",
            }}
          >
            下一条
          </Text>
        </Pressable>
      )} */}
        {!isAutoClick ? (
          <View className=" justify-center flex-row mt-[180]">
            <Image
              source={{
                uri: platformList?.find(
                  (item: any) => item.linkTypeId === linkType,
                )?.mainImage,
              }}
              width={300}
              height={300}
            />
          </View>
        ) : (
          <>
            <Text
              style={{
                position: 'absolute',
                left: -15,
                top: '50%',
                zIndex: 2,
                backgroundColor: 'rgba(0,0,0,.3)',
                padding: 20,
                fontSize: 20,
                color: 'white',
                borderRadius: 50,
              }}>
              {visitTime}
            </Text>
            <View className=" w-full flex-1 mt-[40px]">
              <WebView
                style={{zIndex: -1}}
                source={{
                  uri: uri?.fullLink,
                }}
                injectedJavaScript={handleInjectJavaScript}
                onShouldStartLoadWithRequest={(event: any) => {
                  if (event.url.includes('login')) {
                    setIsStop(true);
                  }
                  return true;
                }}
                onLoad={() => {
                  setIsLoading(true);
                }}
                onLoadEnd={() => {
                  setIsLoading(false);
                }}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
