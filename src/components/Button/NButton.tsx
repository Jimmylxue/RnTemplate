import {
	Pressable,
	Text,
	TouchableOpacity,
	View,
	ViewProps,
} from 'react-native'
import { NIcon, TIconType } from '../Icon/NIcon'
import classNames from 'classnames'

interface TProps extends ViewProps {
	type?: 'primary' | 'default' | 'link'
	onPress?: () => void
	iconName?: string
	iconType?: TIconType
}

export function NButton({
	type = 'default',
	children,
	iconName,
	iconType,
	onPress,
	className,
}: TProps) {
	return (
		<TouchableOpacity onPress={onPress}>
			<View
				className={classNames(
					'p-4',
					{
						'bg-[#f8d55c]': type === 'primary',
						'bg-transparent': type === 'default',
						'border border-solid border-[#f8d55c]': type === 'default',
					},
					className
				)}
			>
				<View className=" flex-row justify-center items-center">
					{iconType && <NIcon name={iconName} iconType={iconType} />}
					<Text
						className={classNames({
							'text-[#f8d55c]': ['link', 'default'].includes(type),
							'text-white': ['primary'].includes(type),
						})}
					>
						{children}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}
