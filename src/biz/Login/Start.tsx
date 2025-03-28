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

  const checkForUpdate = () => {
    codePush.checkForUpdate().then(update => {
      if (update) {
        codePush.sync({
          updateDialog: {
            appendReleaseDescription: false,
            descriptionPrefix: '\n\n更新内容：\n',
            title: '发现新版本',
            mandatoryUpdateMessage: '更新内容：\n' + update.description,
            mandatoryContinueButtonLabel: '确定',
          },
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
            <Text className="  text-3xl font-semibold ">店主之家家家家</Text>
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
