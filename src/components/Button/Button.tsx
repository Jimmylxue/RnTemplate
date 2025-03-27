import {StyleSheet, View, Pressable, Text, ViewProps} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface TProps extends ViewProps {
  theme?: 'primary';
  onPress?: () => void;
  iconName?: string;
}

export default function Button({
  children,
  theme,
  iconName,
  onPress,
  ...args
}: TProps) {
  if (theme === 'primary') {
    return (
      <View style={[styles.buttonContainer]} {...args}>
        <Pressable
          style={[styles.button, {backgroundColor: '#3db2f5'}]}
          onPress={onPress}>
          {iconName && (
            <AntDesign
              name={'up'}
              size={18}
              color="#25292e"
              style={styles.buttonIcon}
            />
          )}
          <Text style={[styles.buttonLabel, {color: 'white'}]}>{children}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer} {...args}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{children}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    // width: 320,
    height: 60,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
