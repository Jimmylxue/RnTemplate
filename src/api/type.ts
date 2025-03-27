export type ClientError = {
	code: number
	message: string
}

export type HTTPClientRequestOptions = {
	/** 自定义的请求头参数 */
	headers?: Record<string, string>
	/**  */
	params?: any
	data?: any
	/** 是否在接口层就提示异常 */
	handleError?: boolean
	/** 是否返回原始响应数据 默认false */
	rawRes?: boolean
}

/**
 * 服务器端异常
 */
export class ServerError extends Error {
	/** 本次请求的axios response */
	public readonly response?: any
	constructor(message = '服务器异常', response?: any) {
		super(message)
		this.response = response
		this.name = 'ServerError'
	}
}

/**
 * 没有登录或者登录已过期的异常
 */
export class UnauthorizedError extends Error {
	constructor(message = '当前用户未登录或登录已过期') {
		super(message)
		this.name = 'UnauthorizedError'
	}
}
