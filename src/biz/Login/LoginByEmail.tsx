import {NButton} from '@components/Button/NButton';
// import { NIcon } from '@components/Icon/NIcon'
import {Input} from '@components/Input';
import {useUser} from '@hooks/useAuth';
import {auth} from '@hooks/useAuth';
import {observer} from 'mobx-react-lite';
import {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {throttle} from 'lodash-es';
import {useSendMail} from '@api/login';
import Toast from 'react-native-toast-message';
import {isQQMail} from '@utils/util';

type TProps = {
  changePage: React.Dispatch<
    React.SetStateAction<'start' | 'login' | 'register'>
  >;
};

export const Login = observer(({changePage}: TProps) => {
  const [mail, setMail] = useState<string>('1002661758@qq.com');
  const [code, setCode] = useState<string>('112233');

  const {loginByMail} = useUser();

  const {mutateAsync: sendMailCode} = useSendMail({
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '验证码发送成功，有效期10分钟',
      });
    },
  });

  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withTiming(1, {duration: 1000});
  }, [opacity]);

  return (
    <Animated.View style={[animatedStyle]}>
      <View className=" mt-[70] px-4">
        {/* <NIcon
					iconType="EvilIcons"
					name="chevron-left"
					color="#FFF"
					size={50}
					onPress={() => {
						changePage('start')
					}}
				/> */}

        <View className=" px-4">
          <View className=" mt-10 ">
            <Text className=" text-white text-5xl">Sign in</Text>
            <Text className=" text-gray-500 text-xl mt-2">
              Sign in to continue {process.env.EXPO_PUBLIC_API_BASE_URL}
              {auth.token}
            </Text>
          </View>
          <View className=" mt-10">
            <Input
              title="Email"
              placeholder="Please type your QQ mail"
              value={mail}
              onChangeText={val => {
                setMail(val);
              }}
              rightNode={
                <NButton
                  type="link"
                  onPress={throttle(async () => {
                    if (!isQQMail(mail)) {
                      Toast.show({
                        type: 'error',
                        text1: '请输入正确的qq邮箱地址',
                      });
                      return;
                    }
                    await sendMailCode({mail});
                  }, 1000)}>
                  Send Mail
                </NButton>
              }
            />
          </View>
          <View className=" mt-10">
            <Input
              title="Verification Code"
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              placeholder="Please type your verification code"
              value={code}
              onChangeText={val => setCode(val)}
            />
          </View>

          <View className=" justify-center flex-row">
            <NButton
              type="primary"
              className=" mt-20 rounded-3xl w-[270]"
              onPress={async () => {
                await loginByMail({mail: mail, code});
              }}>
              Login
            </NButton>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});
