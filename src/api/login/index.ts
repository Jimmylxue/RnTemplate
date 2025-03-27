import {
  UndefinedInitialDataOptions,
  UseMutationOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {ClientError} from '../type';
import http from '../client';

export type TUser = {
  id: number;
  username: string;
  avatar: string;
  sex: 1 | 0;
  phone: string;
  createTime?: string;
  mail: string;
  level: number;
};

export type TUserLoginParams = {
  id: string;
  password: string;
  noEncrypt?: boolean;
};

export type TUserRegisterParams = TUserLoginParams & {
  username: string;
};

export type TLoginResponse = {token: string; user: TUser};

export const useData = (
  config?: Omit<
    UndefinedInitialDataOptions<{name: string}[], ClientError>,
    'queryFn'
  > & {params?: {userId: string}},
) => {
  return useQuery<{name: string}[], ClientError>({
    ...config,
    queryFn: () => http.post('/user/login', {...config?.params}),
    queryKey: config!.queryKey,
  });
};

export const useLogin = (
  config?: UseMutationOptions<TLoginResponse, ClientError, TUserLoginParams>,
) => {
  return useMutation<TLoginResponse, ClientError, TUserLoginParams>({
    mutationFn: async data => {
      const response: any = await http.post('/user/login_by_id', data);
      return response;
    },
    ...config,
  });
};

export const useRegister = (
  config?: UseMutationOptions<any, ClientError, TUserRegisterParams>,
) => {
  return useMutation<any, ClientError, TUserRegisterParams>({
    mutationFn: async data => {
      const response: any = await http.post('user/register', data);
      return response;
    },
    ...config,
  });
};

type TEmailLoginParams = {
  mail: string;
  code: string;
};

export const useLoginByMail = (
  config?: UseMutationOptions<TLoginResponse, ClientError, TEmailLoginParams>,
) => {
  return useMutation<TLoginResponse, ClientError, TEmailLoginParams>({
    mutationFn: async data => {
      const response: any = await http.post('user/login_by_mail', data);
      console.log('response', response);
      return response;
    },
    ...config,
  });
};

/**
 * 发送验证码
 */
export const useSendMail = (
  config?: UseMutationOptions<boolean, ClientError, {mail: string}>,
) => {
  return useMutation<boolean, ClientError, {mail: string}>({
    mutationFn: async data => {
      const response: any = await http.post(
        'mail/send_verification_code',
        data,
      );
      console.log('response', response);
      return response;
    },
    ...config,
  });
};

type TUserLoginByMailParams = {
  mail: string;
  code: string;
};

type TUserRegisterByMailParams = TUserLoginByMailParams & {
  username: string;
};

/**
 * 邮箱注册
 */
export const useUserRegisterByMail = (
  config?: UseMutationOptions<
    TLoginResponse,
    ClientError,
    TUserRegisterByMailParams
  >,
) => {
  return useMutation<TLoginResponse, ClientError, TUserRegisterByMailParams>({
    mutationFn: async data => {
      const response: any = await http.post('user/register_by_mail', data);
      console.log('response', response);
      return response;
    },
    ...config,
  });
};
// export const useLogin = (
// 	config?: Omit<
// 		UndefinedInitialDataOptions<TstOm.VideoService.Group, ClientError>,
// 		'queryFn'
// 	> & { params?: TstOm.VideoService.GroupParams }
// ) => {
// 	return useMutation<{ token: string; user: TUser }, ClientError>({
// 		...config,
// 		mutationFn: () => http.post('/user/login', {}),
// 	})
// }
