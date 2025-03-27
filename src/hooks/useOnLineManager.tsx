import * as React from 'react'
import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'
// import Toast from 'react-native-toast-message'

export function useOnLineManager() {
	React.useEffect(() => {
		return NetInfo.addEventListener(state => {
			if (!state.isConnected) {
				// Toast.show({
				// 	type: 'error',
				// 	text1: '无网络连接',
				// })
			}

			onlineManager.setOnline(state.isConnected != null && state.isConnected)
		})
	}, [])
}
