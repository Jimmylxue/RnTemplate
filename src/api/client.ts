import type {AxiosInstance, AxiosResponse} from 'axios';
import axios, {AxiosError} from 'axios';
import {HTTPClientRequestOptions, ServerError, UnauthorizedError} from './type';
import Toast from 'react-native-toast-message';
import {auth} from '@hooks/useAuth';
import Config from 'react-native-config';
export class HTTPClient {
  static AUTH_TOKEN_HEADER_NAME = 'Authorization';
  // 身份权限
  private _axios: AxiosInstance;

  constructor(baseURL?: string) {
    const http = axios.create({
      baseURL: Config.API_URL,
      timeout: 50 * 1000,
    });

    console.log('API REQUEST', Config.API_URL);

    http.interceptors.request.use(async req => {
      const token = auth.token;
      const header = {
        [HTTPClient.AUTH_TOKEN_HEADER_NAME]: 'Bearer ' + token,
      };
      req.headers = Object.assign(req.headers, header);
      return req;
    });

    http.interceptors.response.use(
      res => {
        console.log('res', res);
        // TODO 根据后端接口格式处理异常
        if (
          res.config.responseType === 'blob' ||
          res.config.responseType === 'arraybuffer'
        ) {
          return res;
          // 服务不按规定返回临时处理
        } else if (![200, 201].includes(res.data?.code) && res.status !== 200) {
          console.log('res', res);
          const message = res.data?.result || res.data?.message || '未知异常';
          return Promise.reject(
            new ServerError(message.replace('参数异常:', ''), res),
          );
        }
        return res;
      },
      err => {
        console.log('err', err);
        let error = err;

        console.log('哇 NG', error.response.data.message);

        // 处理一下特定的服务端异常
        if (err instanceof AxiosError) {
          const codes = [
            err?.status,
            err.response?.data?.code,
            err?.code,
            err?.response?.status,
          ];
          const isUnauthorized = codes.includes(401);
          const isForbidden = codes.includes(403);
          if (isUnauthorized || isForbidden) {
            // 这里添加一个接口返回鉴权失效情况下的，全局状态的清理逻辑
            error = new UnauthorizedError();
          }
        }

        return Promise.reject(error);
      },
    );

    this._axios = http;
  }

  public static createForBaseURL(baseURL: string): HTTPClient {
    return new HTTPClient(baseURL);
  }

  private _showMessage = (options: any = {handleError: true}) => {
    const {handleError = true} = options;
    return (error: Error) => {
      /** Sentry 上报接口错误信息 */
      // Sentry.captureException(error)

      if (!handleError) {
        return Promise.reject(error);
      }

      // @ts-ignore
      const message = error.response.data.message || error.message;

      Toast.show({
        // position: 'bottom',
        type: 'error',
        text1: message,
      });

      console.log('>>>><<<<error', error);

      return Promise.reject(error);
    };
  };

  /** 获取有效的相依数据 */
  private _getResPayload(
    options: HTTPClientRequestOptions = {rawRes: false},
  ): any {
    const {rawRes = false} = options;

    return (res: AxiosResponse) => {
      return rawRes ? res : res.data.result;
    };
  }

  get<T>(url: string, options?: undefined): Promise<T> {
    return this._axios
      .get<T, T>(url, options)
      .then(this._getResPayload(options))
      .catch(this._showMessage(options));
  }

  post<T>(
    url: string,
    data?: any,
    options?: HTTPClientRequestOptions | undefined,
  ): Promise<T> {
    return this._axios
      .post<T, T>(url, data ?? {}, options)
      .then(this._getResPayload(options))
      .catch(this._showMessage(options));
  }

  put<T>(
    url: string,
    data?: any,
    options?: HTTPClientRequestOptions | undefined,
  ): Promise<T> {
    return this._axios
      .put<T, T>(url, data, options)
      .then(this._getResPayload(options))
      .catch(this._showMessage(options));
  }

  delete<T>(
    url: string,
    options?: HTTPClientRequestOptions | undefined,
  ): Promise<T> {
    return this._axios
      .delete<T, T>(url, options)
      .then(this._getResPayload(options))
      .catch(this._showMessage(options));
  }

  patch<T>(
    url: string,
    data?: any,
    options?: HTTPClientRequestOptions | undefined,
  ): Promise<T> {
    return this._axios
      .patch<T, T>(url, data, options)
      .then(this._getResPayload(options))
      .catch(this._showMessage(options));
  }
}

const http = new HTTPClient();
export default http;
