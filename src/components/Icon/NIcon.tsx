import FontAwesome from '@react-native-vector-icons/fontawesome';
import AntDesign from '@react-native-vector-icons/ant-design';
import Entypo from '@react-native-vector-icons/entypo';
import EvilIcons from '@react-native-vector-icons/evil-icons';
import Feather from '@react-native-vector-icons/feather';
import {Pressable} from 'react-native';

export type TIconType =
  | 'FontAwesome'
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather';

interface TProps extends IconProps<any> {
  iconType: TIconType;
  onPress?: () => void;
}

export function NIcon({iconType, onPress, ...arg}: TProps) {
  // @ts-ignore
  const args = {...arg, size: arg.size ? arg.size : 40};
  const iconMap = {
    FontAwesome: <FontAwesome {...args} />,
    AntDesign: <AntDesign {...args} />,
    Entypo: <Entypo {...args} />,
    EvilIcons: <EvilIcons {...args} />,
    Feather: <Feather {...args} />,
  };
  return <Pressable onPress={onPress}>{iconMap[iconType]}</Pressable>;
}
