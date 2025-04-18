import Button from '@components/Button/Button';
import {observer} from 'mobx-react-lite';
import {useEffect} from 'react';
import {Image, Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import codePush from 'react-native-code-push';
import Toast from 'react-native-toast-message';
import RNRestart from 'react-native-restart';

type TProps = {
  changePage: React.Dispatch<
    React.SetStateAction<'start' | 'login' | 'register'>
  >;
};

export const StartIndex = observer(({changePage}: TProps) => {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  console.log('StartIndex');

  useEffect(() => {
    console.log('StartIndex useEffect');
    opacity.value = withTiming(1, {duration: 1000});
  }, [opacity]);

  useEffect(() => {
    checkForUpdate();
  }, []);

  const checkForUpdate = () => {
    Toast.show({
      text1: '检查更新中....',
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

  return (
    <Animated.View style={[animatedStyle]} className="h-full">
      <View className="h-full">
        <View className=" justify-center flex-row mt-[180]">
          <Image
            className=" size-[200]"
            source={require('@assets/images/talk.png')}
          />
        </View>

        <View className="  mb-5 mt-10">
          <View className="flex-row justify-center items-center">
            <Text className="  text-3xl font-semibold text-black ">
              店主之家
            </Text>
          </View>
        </View>

        <View className="absolute bottom-40 w-full flex-row justify-center">
          <Button
            theme="primary"
            iconName="glass"
            className=" rounded-lg w-[270]"
            onPress={() => {
              changePage('login');
            }}>
            登录
          </Button>
        </View>
        <View className="absolute bottom-20 w-full flex-row justify-center">
          <Button
            theme="primary"
            iconName="glass"
            className=" rounded-lg w-[270]"
            onPress={() => {
              checkForUpdate();
            }}>
            检查更新
          </Button>
        </View>
      </View>
    </Animated.View>
  );
});
