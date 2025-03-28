import {
  TLoginResponse,
  TUser,
  TUserRegisterParams,
  useLogin,
  useLoginByMail,
  useRegister,
} from '@api/login';
import {
  getLoginPassword,
  getLoginPhone,
  removeAuthToken,
  setAuthToken,
  setAuthUser,
  setLoginPassword,
  setLoginPhone,
} from '@utils/storage';

import {action, makeAutoObservable, observable, configure} from 'mobx';
import {useEffect} from 'react';
import Toast from 'react-native-toast-message';

configure({enforceActions: 'observed'});

class Auth {
  shouldLogin: boolean = true;

  user?: TUser;

  phone?: string = '';

  password?: string = '';

  @observable token?: string = '';

  constructor() {
    makeAutoObservable(this);
    this.initState();
  }

  private async initState() {
    // const [token, user] = await Promise.all([
    // await getAuthToken(),
    // 	await getAuthUser(),
    // ])
    // this.user = JSON.parse(user!)
    // this.token = token || ''

    const [phone, password] = await Promise.all([
      await getLoginPhone(),
      await getLoginPassword(),
    ]);

    console.log('phpne', phone, password);

    this.phone = phone || '';
    this.password = password || '';
  }

  @action setShouldLoginStatus(status: boolean) {
    this.shouldLogin = status;
  }

  @action setLoginUser(user?: TUser) {
    this.user = user;
  }

  @action setToken(token?: string) {
    this.token = token;
  }
}

export const auth = new Auth();

const loginSuccessCallback = async (res: TLoginResponse) => {
  Toast.show({
    type: 'success',
    text1: '登录成功',
    position: 'bottom',
    visibilityTime: 500,
  });
  await setAuthToken(res.token);
  await setAuthUser(JSON.stringify(res.user));
  auth.setLoginUser(res.user);
  auth.setToken(res.token);
};

export function useUser() {
  const {mutateAsync} = useLogin({
    onSuccess: loginSuccessCallback,
  });
  const {mutateAsync: registerFn} = useRegister({
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '注册成功',
      });
    },
  });

  /**
   * 邮箱登录
   */
  const {mutateAsync: loginByMail} = useLoginByMail({
    onSuccess: loginSuccessCallback,
  });

  useEffect(() => {
    // try {
    //   const user = JSON.parse(localStorage.getItem('login-user')!);
    //   if (user) {
    //     auth.setLoginUser(user);
    //   } else {
    //     auth.setShouldLoginStatus(true);
    //   }
    // } catch {
    //   auth.setShouldLoginStatus(true);
    // }
  }, []);

  const login = async (params: {
    id: string;
    password: string;
    noEncrypt?: boolean;
  }) => {
    await mutateAsync({
      id: params.id,
      password: params.password,
      noEncrypt: params.noEncrypt,
    });
    await setLoginPhone(params.id);
    await setLoginPassword(params.password);
  };

  const register = async (params: TUserRegisterParams) => {
    await registerFn(params);
  };

  const showLoginModal = () => {
    auth.setShouldLoginStatus(true);
  };

  const checkUserLoginBeforeFn = () => {
    if (auth.user?.id) {
      return true;
    }
    showLoginModal();
    return false;
  };

  const updateUser = async (user: TUser) => {
    await setAuthUser(JSON.stringify(user));
    auth.setLoginUser(user);
  };

  const logOut = async () => {
    auth.user = undefined;
    auth.setLoginUser(undefined);
    await removeAuthToken();
    await setAuthUser('');
    auth.setToken('');
    Toast.show({type: 'info', text1: '已退出'});
    auth.setShouldLoginStatus(true);
  };

  return {
    user: auth.user,
    login,
    showLoginModal,
    register,
    checkUserLoginBeforeFn,
    updateUser,
    logOut,
    loginByMail,
    phone: auth.phone,
    password: auth.password,
  };
}
