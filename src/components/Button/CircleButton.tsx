import { View, Pressable, StyleSheet } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import classNames from 'classnames'

type TProps = {
	onPress: () => void
	theme?: 'primary'
	iconName: string
	size?: 'sm' | 'md' | 'lg'
}

export default function CircleButton({
	size = 'lg',
	theme,
	iconName,
	onPress,
}: TProps) {
	return (
		<View
			className={classNames('', {
				'size-[84]': size === 'lg',
				'size-[64]': size === 'md',
				'size-[44]': size === 'sm',
			})}
			style={theme === 'primary' ? styles.primaryStyle : {}}
		>
			<Pressable style={styles.circleButton} onPress={onPress}>
				<AntDesign
					name={(iconName as any) || 'add'}
					size={38}
					color="#25292e"
				/>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	primaryStyle: {
		borderWidth: 4,
		borderColor: '#ffd33d',
		borderRadius: 42,
		padding: 3,
	},
	circleButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 42,
		backgroundColor: '#fff',
	},
})
