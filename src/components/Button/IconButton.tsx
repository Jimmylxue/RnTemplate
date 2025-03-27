import { Pressable, StyleSheet, Text } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'

type TProps = {
	label: string
	onPress: () => void
	icon: any
}

export default function IconButton({ icon, label, onPress }: TProps) {
	return (
		<Pressable style={styles.iconButton} onPress={onPress}>
			<AntDesign name={icon} size={24} color="#fff" />
			<Text style={styles.iconButtonLabel}>{label}</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	iconButton: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconButtonLabel: {
		color: '#fff',
		marginTop: 12,
	},
})
