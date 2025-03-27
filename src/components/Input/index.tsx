import classNames from 'classnames'
import {
	Button,
	Text,
	TextInput,
	TextInputProps,
	TouchableOpacity,
	View,
} from 'react-native'
import { NButton } from '../Button/NButton'
import { ReactNode } from 'react'

interface TProps extends TextInputProps {
	title: string
	rightNode?: ReactNode
}

export function Input({ title, className, rightNode, ...args }: TProps) {
	return (
		<View>
			{title && (
				<View>
					<Text className=" text-gray-300 font-semibold text-lg">{title}</Text>
				</View>
			)}
			<View className=" flex-row border-b border-solid border-white">
				<TextInput
					placeholderTextColor="#d1d5db"
					className={classNames(
						'  py-4 text-gray-300 text-lg -mt-2 flex-grow',
						className
					)}
					placeholder="Please type your name"
					{...args}
				/>
				{rightNode}
			</View>
		</View>
	)
}
