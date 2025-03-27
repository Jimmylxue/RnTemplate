import { NButton } from '@src/components/Button/NButton'
import { NIcon } from '@src/components/Icon/NIcon'
import { Input } from '@src/components/Input'
import { useEffect } from 'react'
import { Text, View } from 'react-native'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated'

type TProps = {
	changePage: React.Dispatch<
		React.SetStateAction<'start' | 'login' | 'register'>
	>
}

export function Register({ changePage }: TProps) {
	const opacity = useSharedValue(0)

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		}
	})

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 1000 })
	}, [opacity])

	return (
		<Animated.View style={[animatedStyle]}>
			<View className=" mt-[70] px-4">
				<NIcon
					iconType="EvilIcons"
					name="chevron-left"
					color="#FFF"
					size={50}
					onPress={() => {
						changePage('start')
					}}
				/>

				<View className=" px-4">
					<View className=" mt-10 ">
						<Text className=" text-white text-5xl">Sign Up</Text>
						<Text className=" text-gray-500 text-xl mt-2">Sign in to join</Text>
					</View>
					<View className=" mt-10">
						<Input title="Email" placeholder="Please type your name" />
					</View>
					<View className=" mt-10">
						<Input
							title="Password"
							secureTextEntry
							autoComplete="password"
							textContentType="password"
							placeholder="Please type your password"
						/>
					</View>
					<View className=" mt-10">
						<Input
							title="Confirm Password"
							secureTextEntry
							autoComplete="password"
							textContentType="password"
							placeholder="Please type your password again"
						/>
					</View>

					<View className=" justify-center flex-row">
						<NButton type="primary" className=" mt-20 rounded-3xl w-full">
							Register
						</NButton>
					</View>
				</View>
			</View>
		</Animated.View>
	)
}
